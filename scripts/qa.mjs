// Repeatable QA for the Southwest Pro Painting sample.
//
//   npm run build && npx vite preview --port 4173 &      (in one terminal)
//   npm run qa                                             (in another)
//
// What it checks, for every route at desktop (1440), tablet (820) and phone (390):
//   - full-page screenshot into qa/screens
//   - no horizontal overflow, no console errors/warnings, no failed requests, no broken images
//   - zero axe violations (WCAG 2.0/2.1 A and AA)
// Then it scripts every interaction (finder, lab, services, planner, gallery, lightbox, menu, links).
//
// Network safety: requests to southwestpro.com are STUBBED in the browser, so clicking an estimate
// button proves where it goes without loading Ryan's site or touching his form.
// One plain GET (outside the browser) confirms the real /estimates route is live.

import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';
import AxeBuilder from '@axe-core/playwright';

const BASE = process.env.BASE_URL || 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const OUT = path.resolve('qa');
const SHOTS = path.join(OUT, 'screens');
fs.mkdirSync(SHOTS, { recursive: true });

const ESTIMATE = 'https://www.southwestpro.com/estimates';
const TEL = 'tel:+13208158216';
const routes = ['/', '/homes', '/business', '/work', '/about', '/not-a-page'];
const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 820, height: 1180 },
  { name: 'phone', width: 390, height: 844, mobile: true },
];

const results = [];
const check = (name, ok, detail = '') => {
  results.push({ name, ok: !!ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`);
};

const browser = await chromium.launch({ executablePath: CHROME, headless: true });

async function newCtx(vp, extra = {}) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.mobile ? 2 : 1,
    isMobile: !!vp.mobile,
    hasTouch: !!vp.mobile,
    ...extra,
  });
  // never touch Ryan's real site from the browser
  await ctx.route('https://www.southwestpro.com/**', (r) => r.fulfill({ status: 200, contentType: 'text/html', body: '<title>stub</title>stub' }));
  return ctx;
}

function watch(page, bucket) {
  page.on('console', (m) => ['error', 'warning'].includes(m.type()) && bucket.push(`${m.type()}: ${m.text()}`));
  page.on('pageerror', (e) => bucket.push(`pageerror: ${e.message}`));
  page.on('requestfailed', (r) => bucket.push(`requestfailed: ${r.url()} ${r.failure()?.errorText}`));
  page.on('response', (r) => r.status() >= 400 && !r.url().includes('southwestpro.com') && bucket.push(`http ${r.status()}: ${r.url()}`));
}

async function scrollThrough(page) {
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += 500) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(70);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(350);
}

// ------------------------------------------------------------------ 1. every route x viewport
for (const vp of viewports) {
  const ctx = await newCtx(vp);
  for (const r of routes) {
    const page = await ctx.newPage();
    const bucket = [];
    watch(page, bucket);
    await page.goto(BASE + r, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    await scrollThrough(page);
    const tag = `${vp.name} ${r}`;
    await page.screenshot({ path: path.join(SHOTS, `${r === '/' ? 'home' : r.slice(1)}-${vp.name}.png`), fullPage: true });

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    check(`no horizontal overflow  [${tag}]`, overflow <= 1, overflow > 1 ? `by ${overflow}px` : '');

    const broken = await page.evaluate(() =>
      [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.currentSrc).map((i) => i.currentSrc),
    );
    check(`no broken images  [${tag}]`, broken.length === 0, broken.join(', '));

    const noisy = bucket.filter((b) => !(r === '/not-a-page' && b.includes('404')));
    check(`no console errors or failed requests  [${tag}]`, noisy.length === 0, noisy.join(' | '));

    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    check(
      `axe: 0 violations  [${tag}]`,
      axe.violations.length === 0,
      axe.violations.map((v) => `${v.id}(${v.nodes.length}): ${v.nodes[0].target.join(' ')}`).join(' | '),
    );

    const h1s = await page.locator('h1').count();
    check(`exactly one h1  [${tag}]`, h1s === 1, `found ${h1s}`);
    await page.close();
  }
  await ctx.close();
}

// ------------------------------------------------------------------ 2. links
{
  const res = await fetch(ESTIMATE, { headers: { 'user-agent': 'Mozilla/5.0 (sample link check)' } });
  const text = await res.text();
  check('real estimate route is live (HTTP 200)', res.status === 200, `status ${res.status}`);
  check('real estimate route is the estimate form page', /FREE ESTIMATE/i.test(text) && /estimate form/i.test(text));

  const ctx = await newCtx(viewports[0]);
  for (const r of ['/', '/homes', '/business', '/work', '/about']) {
    const page = await ctx.newPage();
    await page.goto(BASE + r, { waitUntil: 'networkidle' });
    const links = await page.$$eval('a[data-estimate]', (as) => as.map((a) => ({ href: a.href, target: a.target, rel: a.rel, where: a.dataset.estimate })));
    check(`estimate buttons present  [${r}]`, links.length >= 2, `${links.length} found`);
    check(
      `every estimate button goes to the existing route, new tab, noopener  [${r}]`,
      links.every((l) => l.href === ESTIMATE && l.target === '_blank' && /noopener/.test(l.rel)),
      links.filter((l) => l.href !== ESTIMATE).map((l) => l.href).join(', '),
    );
    const tels = await page.$$eval('a[data-call], a[href^="tel:"]', (as) => as.map((a) => a.getAttribute('href')));
    check(`phone links use the published number  [${r}]`, tels.length > 0 && tels.every((t) => t === TEL), tels.filter((t) => t !== TEL).join(','));
    await page.close();
  }
  // click one for real (stubbed network) and confirm the navigation target
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  const popupP = ctx.waitForEvent('page');
  await page.locator('a[data-estimate="header"]').click();
  const popup = await popupP;
  await popup.waitForLoadState();
  check('clicking Free estimate opens the existing estimate URL', popup.url() === ESTIMATE, popup.url());
  await popup.close();
  await ctx.close();
}

// ------------------------------------------------------------------ 3. interactions, desktop
{
  const ctx = await newCtx(viewports[0]);
  const page = await ctx.newPage();
  const bucket = [];
  watch(page, bucket);
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });

  // finder
  const labelBefore = await page.locator('.fan-label').innerText();
  await page.getByLabel(/Restaurant or food service/).check({ force: true });
  await page.waitForTimeout(400);
  check('finder: choosing a type changes the photos', (await page.locator('.fan > li').count()) === 3 && /restaurant/i.test(await page.locator('.fan-label').innerText()), `${labelBefore} -> ${await page.locator('.fan-label').innerText()}`);
  check('finder: all fan photos have alt text', (await page.locator('.fan img:not([alt]), .fan img[alt=""]').count()) === 0);
  await page.getByLabel(/Inside my house/).check({ force: true });
  check('finder: switching type again works', /inside/i.test(await page.locator('.fan-label').innerText()));
  await page.keyboard.press('Tab'); // keyboard reachable
  await page.getByRole('link', { name: /See all \d+ photos/ }).click();
  await page.waitForURL(/\/work\?c=home-interior/);
  check('finder: "See all" opens the filtered Our work page', (await page.locator('.masonry > li').count()) === 6, `${await page.locator('.masonry > li').count()} photos`);
  await page.goBack();

  // lab
  await page.locator('#prep-lab').scrollIntoViewIfNeeded();
  const step = () => page.locator('svg.house').getAttribute('data-step');
  check('lab: starts at "before"', (await step()) === '0');
  await page.getByRole('button', { name: /Next step/ }).click();
  check('lab: Next step advances', (await step()) === '1');
  await page.locator('.lab-steps li:nth-child(4) button').click();
  check('lab: clicking a step jumps to it', (await step()) === '3');
  await page.locator('.swatches').first().locator('label').nth(1).click();
  check('lab: picking a color shows it painted (step 4+)', Number(await step()) >= 4);
  const sidingVar = await page.locator('svg.house').evaluate((el) => el.style.getPropertyValue('--siding'));
  check('lab: siding color applied', sidingVar.toLowerCase() === '#a8473b', sidingVar);
  await page.locator('.lab-steps li:nth-child(1) button').click();
  await page.getByRole('button', { name: /Watch the job/ }).click();
  await page.waitForTimeout(5200);
  check('lab: "Watch the job" autoplays forward', Number(await step()) >= 2, `step ${await step()}`);
  await page.getByRole('button', { name: /Pause/ }).click();
  const frozen = await step();
  await page.waitForTimeout(2600);
  check('lab: Pause stops autoplay', (await step()) === frozen);

  // email draft reflects choices
  await page.locator('#estimate').scrollIntoViewIfNeeded();
  const mail = await page.locator('a[data-email="panel"]').getAttribute('href');
  const body = decodeURIComponent(mail.split('body=')[1] || '');
  check('estimate panel: email draft opens mailto to Ryan', mail.startsWith('mailto:ryan@southwestpro.com?subject='));
  check('estimate panel: email draft includes the colors tried', /Barn red siding/.test(body) && /Inside my house/.test(body), body.replace(/\r?\n/g, ' / '));
  check('estimate panel: says nothing is sent', /does not collect or send anything/.test(await page.locator('.estimate-honest').innerText()));

  // homes: services
  await page.goto(BASE + '/homes', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Decks', exact: true }).click();
  check('services: pill toggles on', (await page.getByRole('button', { name: 'Decks', exact: true }).getAttribute('aria-pressed')) === 'true');
  await page.getByRole('tab', { name: 'Interior' }).click();
  check('services: interior list shows Ryan\'s 17 services', (await page.locator('.pills .pill').count()) === 17);
  await page.getByRole('tab', { name: 'Exterior' }).click();
  check('services: exterior list shows Ryan\'s 16 services', (await page.locator('.pills .pill').count()) === 16);
  check('services: selection reaches the estimate notes', /Decks/.test(await page.locator('.estimate-card .notes').innerText()));

  // business: tabs + planner
  await page.goto(BASE + '/business', { waitUntil: 'networkidle' });
  await page.getByRole('tab', { name: /Garage or service building/ }).click();
  check('business tabs: service buildings shows the ambulance building', (await page.locator('#bt-panel img[alt*="Tracy Ambulance"]').count()) === 1);
  await page.getByRole('tab', { name: /Storefront, gym or shop/ }).click();
  check('business tabs: storefront shows 3 photos', (await page.locator('#bt-panel .chipcard').count()) === 3);
  await page.getByLabel('Exterior walls').check({ force: true });
  await page.getByLabel('Ceilings').check({ force: true });
  check('planner: ticking zones highlights them', (await page.locator('.store .hl[data-on="true"]').count()) >= 2);
  await page.selectOption('#occ', { index: 1 });
  await page.selectOption('#brand', { index: 1 });
  const notes = await page.locator('.estimate-card .notes').innerText();
  check('planner: answers reach the estimate notes', /Exterior walls/.test(notes) && /Ceilings/.test(notes) && /during the work/i.test(notes) && /Storefront, gym or shop/.test(notes), notes.replace(/\n/g, ' | '));
  const planMail = decodeURIComponent((await page.locator('a[data-email="panel"]').getAttribute('href')).split('body=')[1]);
  check('planner: email draft includes the scope', /Needs paint: Exterior walls, Ceilings/.test(planMail));

  // work: filters + lightbox
  await page.goto(BASE + '/work', { waitUntil: 'networkidle' });
  const all = await page.locator('.masonry > li').count();
  await page.getByRole('button', { name: 'Business', exact: true }).click();
  const biz = await page.locator('.masonry > li').count();
  check('work: filter narrows the gallery', biz > 0 && biz < all, `${all} -> ${biz}`);
  await page.locator('.masonry .chipcard-btn').first().click();
  check('lightbox: opens as a modal dialog', await page.locator('dialog.lightbox[open]').count() === 1);
  const cap1 = await page.locator('dialog.lightbox .lb-bar strong').innerText();
  await page.keyboard.press('ArrowRight');
  const cap2 = await page.locator('dialog.lightbox .lb-bar strong').innerText();
  check('lightbox: arrow key moves to the next photo', cap1 !== cap2, `${cap1} -> ${cap2}`);
  await page.keyboard.press('Escape');
  check('lightbox: Escape closes it', (await page.locator('dialog.lightbox[open]').count()) === 0);
  check('lightbox: focus returns to the page', await page.evaluate(() => document.activeElement && document.activeElement.tagName !== 'BODY'));

  // keyboard: skip link
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.keyboard.press('Tab');
  check('keyboard: first Tab lands on the skip link', (await page.evaluate(() => document.activeElement?.className)) === 'skip');
  check('metadata: robots noindex present', (await page.locator('meta[name="robots"]').getAttribute('content')) === 'noindex, nofollow');
  check('metadata: no canonical pointing at the real domain', (await page.locator('link[rel="canonical"]').count()) === 0);
  check('no console errors during interaction run', bucket.length === 0, bucket.join(' | '));
  await ctx.close();
}

// ------------------------------------------------------------------ 4. interactions, phone
{
  const vp = viewports[2];
  const ctx = await newCtx(vp);
  const page = await ctx.newPage();
  const bucket = [];
  watch(page, bucket);
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  const bar = page.locator('.sticky-bar');
  check('phone: sticky Call + Free estimate bar is visible', await bar.isVisible());
  check('phone: sticky Free estimate goes to the existing route', (await page.locator('.sticky-est').getAttribute('href')) === ESTIMATE);
  check('phone: sticky Call uses the published number', (await page.locator('.sticky-call').getAttribute('href')) === TEL);
  const box = await bar.boundingBox();
  check('phone: sticky bar stays at the bottom of the screen', Math.abs(box.y + box.height - vp.height) <= 1, `bottom=${box.y + box.height}`);
  await page.evaluate(() => window.scrollTo(0, 3000));
  check('phone: sticky bar still visible after scrolling', await bar.isVisible());

  // thumb-size targets for the primary controls
  const small = await page.$$eval('.sticky-bar a, .menu-btn, .pick-body, .pill, .btn', (els) =>
    els.filter((e) => { const r = e.getBoundingClientRect(); return r.width && r.height && (r.height < 44 || r.width < 44); }).map((e) => e.className));
  check('phone: primary tap targets are at least 44px tall', small.length === 0, small.join(','));

  await page.evaluate(() => window.scrollTo(0, 0));
  const above = await page.locator('.pick').first().boundingBox();
  check('phone: project chooser is visible on the first screen', above.y + above.height < vp.height - 60, `y=${Math.round(above.y)}`);

  await page.getByLabel(/Storefront, gym or shop/).check({ force: true });
  await page.waitForTimeout(500);
  check('phone: finder swaps the swipe row', (await page.locator('.fan > li').count()) === 3);
  check('phone: swipe row scrolls sideways', await page.locator('.fan').evaluate((el) => el.scrollWidth > el.clientWidth));

  await page.getByRole('button', { name: /Menu/ }).click();
  check('phone: menu opens', await page.locator('#mobile-menu').isVisible());
  check('phone: menu has the estimate button', await page.locator('#mobile-menu a[data-estimate="menu"]').isVisible());
  await page.locator('#mobile-menu nav a', { hasText: 'Business' }).click();
  await page.waitForURL(/\/business$/);
  await page.waitForSelector('#mobile-menu', { state: 'detached', timeout: 3000 }).catch(() => {});
  check('phone: menu navigates and closes', (await page.locator('#mobile-menu').count()) === 0);
  check('phone: no console errors', bucket.length === 0, bucket.join(' | '));
  await ctx.close();
}

// ------------------------------------------------------------------ 5. reduced motion
{
  const ctx = await newCtx(viewports[2], { reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(BASE + '/homes', { waitUntil: 'networkidle' });
  const hidden = await page.$$eval('.reveal', (els) => els.filter((e) => getComputedStyle(e).opacity === '0').length);
  check('reduced motion: nothing stays hidden waiting for a scroll animation', hidden === 0, `${hidden} hidden`);
  await ctx.close();
}

await browser.close();

const failed = results.filter((r) => !r.ok);
fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify({ when: new Date().toISOString(), base: BASE, total: results.length, failed: failed.length, results }, null, 2));
console.log(`\n${results.length - failed.length}/${results.length} checks passed.`);
if (failed.length) {
  console.log('\nFAILED:');
  failed.forEach((f) => console.log(' -', f.name, f.detail));
  process.exit(1);
}
