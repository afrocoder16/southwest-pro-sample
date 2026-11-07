// Generates named, easy-to-open screenshots (first screens and interaction states) into qa/previews.
//   npm run build && npx vite preview --port 4173      then      node scripts/previews.mjs
import fs from 'node:fs';
import { chromium } from 'playwright-core';

const BASE = process.env.BASE_URL || 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const OUT = 'qa/previews';
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const pages = [['home', '/'], ['homes', '/homes'], ['business', '/business'], ['work', '/work'], ['about', '/about'], ['estimate', '/estimate'], ['contact', '/contact'], ['careers', '/careers']];

async function settle(page, ms = 1400) {
  await page.waitForTimeout(ms);
  await page.waitForFunction(() => [...document.images].filter((i) => i.getBoundingClientRect().top < innerHeight * 2).every((i) => i.complete), null, { timeout: 5000 }).catch(() => {});
}
async function shoot(page, name, scrollTo) {
  if (scrollTo) {
    await page.locator(scrollTo).first().scrollIntoViewIfNeeded();
    await page.evaluate((sel) => document.querySelector(sel)?.scrollIntoView({ block: 'start' }), scrollTo);
  }
  await settle(page, 900);
  await page.screenshot({ path: `${OUT}/${name}.png` });
}

for (const [vpName, vp] of [['desktop', { width: 1440, height: 900 }], ['phone', { width: 390, height: 844, mobile: true }]]) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: vp.mobile ? 2 : 1, isMobile: !!vp.mobile, hasTouch: !!vp.mobile });
  const page = await ctx.newPage();

  for (const [name, path] of pages) {
    await page.goto(BASE + path, { waitUntil: 'networkidle' });
    await settle(page);
    await page.screenshot({ path: `${OUT}/${vpName}-${name}.png` });
  }

  // home: finder, fall promo, viewer, reviews, about + hiring
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.locator('.finder').getByLabel(/Barn or farm building/).check({ force: true });
  await settle(page, 1200);
  if (vp.mobile) await page.locator('.fan-wrap').scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${OUT}/${vpName}-home-finder-barn.png` });
  await shoot(page, `${vpName}-home-fall-promo`, '.fall');
  await page.evaluate(() => document.querySelector('#results').scrollIntoView({ block: 'start' }));
  await page.waitForTimeout(3300);
  await settle(page, 300);
  await page.screenshot({ path: `${OUT}/${vpName}-home-before-after-and-reviews.png` });
  await page.locator('#results-viewer .cmp-range').fill('18');
  await page.getByRole('button', { name: 'Next comment' }).click();
  await page.locator('#results-viewer .cmp-chip', { hasText: 'Red barn' }).click();
  await page.waitForTimeout(3300);
  await page.locator('#results-viewer .cmp-range').fill('30');
  await page.screenshot({ path: `${OUT}/${vpName}-home-red-barn-roller-dragged.png` });
  await shoot(page, `${vpName}-home-about-and-hiring`, '.about-tease');

  // forms: errors, then the honest confirmation
  await page.goto(BASE + '/estimate', { waitUntil: 'networkidle' });
  await settle(page);
  await page.getByRole('button', { name: 'Request my free estimate' }).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/${vpName}-estimate-form-errors.png` });
  await page.getByRole('button', { name: 'Fill in sample details' }).click();
  await page.getByRole('button', { name: 'Request my free estimate' }).click();
  await page.waitForSelector('.sent');
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/${vpName}-estimate-confirmation-sample-preview.png` });

  // business planner
  await page.goto(BASE + '/business', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.querySelector('#walkthrough').scrollIntoView({ block: 'start' }));
  await page.waitForTimeout(500);
  await page.locator('label.zone-pill', { hasText: 'Exterior walls' }).click();
  await page.locator('label.zone-pill', { hasText: 'Ceilings' }).click();
  await page.locator('label.zone-pill', { hasText: 'Concrete floors' }).click();
  await shoot(page, `${vpName}-business-planner`, '.planner-art');
  await ctx.close();
}
await browser.close();
console.log('done');
