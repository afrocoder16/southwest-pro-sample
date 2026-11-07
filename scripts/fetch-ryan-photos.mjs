// Downloads the original photos from Ryan's public website into .cache/ryan-orig (git-ignored).
// Read-only GET requests for files his site already serves publicly. Nothing is sent to the site.
import fs from 'node:fs';
import path from 'node:path';
import { photos } from './photos.config.mjs';

const dir = path.resolve('.cache/ryan-orig');
fs.mkdirSync(dir, { recursive: true });

for (const p of photos) {
  const out = path.join(dir, `${p.id}.jpg`);
  if (fs.existsSync(out) && fs.statSync(out).size > 1000) { console.log('have', p.id); continue; }
  const url = `https://static.wixstatic.com/media/${p.wix}`;
  const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 (design-sample photo fetch)' } });
  if (!res.ok) throw new Error(`${p.id}: HTTP ${res.status}`);
  fs.writeFileSync(out, Buffer.from(await res.arrayBuffer()));
  console.log('got ', p.id);
}
