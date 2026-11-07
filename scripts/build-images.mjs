// Turns the original photos into web-sized WebP files (480 / 960 / 1600 wide) in public/work,
// strips EXIF/GPS metadata, applies any crop from photos.config.mjs, and records each photo's
// size and dominant colour in src/data/photos.generated.json.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { photos, widths } from './photos.config.mjs';

const src = path.resolve('.cache/ryan-orig');
const out = path.resolve('public/work');
fs.mkdirSync(out, { recursive: true });
const meta = {};

const hex = (n) => Math.round(n).toString(16).padStart(2, '0');

// Paint-chip colour: the average of a small patch on the painted surface (point chosen per photo in the config).
async function patchColor(buf, W, H, [x, y]) {
  const size = Math.max(8, Math.round(W * 0.03));
  const left = Math.min(W - size, Math.max(0, Math.round(x * W - size / 2)));
  const top = Math.min(H - size, Math.max(0, Math.round(y * H - size / 2)));
  const { data } = await sharp(buf).extract({ left, top, width: size, height: size }).resize(1, 1).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  return `#${hex(data[0])}${hex(data[1])}${hex(data[2])}`;
}

for (const p of photos) {
  const file = p.local ? path.resolve(p.local) : path.join(src, `${p.id}.jpg`);
  if (!fs.existsSync(file)) throw new Error(`Missing ${file}. ${p.local ? 'Expected the supplied photo folder next to web/.' : 'Run: npm run photos:fetch'}`);
  let base = sharp(file).rotate(); // apply EXIF orientation, metadata is dropped on output
  const info0 = await base.clone().toBuffer({ resolveWithObject: true });
  let W = info0.info.width, H = info0.info.height;
  let buf = info0.data;
  if (p.crop) {
    const [l, t, w, h] = p.crop;
    const region = { left: Math.round(l * W), top: Math.round(t * H), width: Math.round(w * W), height: Math.round(h * H) };
    buf = await sharp(buf).extract(region).toBuffer();
    W = region.width; H = region.height;
  }
  // Sizes: every configured width smaller than the source, plus the source's own width
  // (capped at the largest configured width). Never upscale.
  const top = Math.min(widths.at(-1), W);
  const sizes = [...new Set([...widths.filter((w) => w < top), top])];
  for (const w of sizes) {
    const f = path.join(out, `${p.id}-${w}.webp`);
    await sharp(buf).resize({ width: w, withoutEnlargement: true }).webp({ quality: 74, effort: 5 }).toFile(f);
  }
  const outH = Math.round((top / W) * H);
  meta[p.id] = { w: top, h: outH, sizes, color: p.color || await patchColor(buf, W, H, p.swatch) };
  console.log(p.id.padEnd(15), sizes.join('/'), `${meta[p.id].w}x${meta[p.id].h}`, meta[p.id].color);
}
fs.writeFileSync(path.resolve('src/data/photos.generated.json'), JSON.stringify(meta, null, 2));
