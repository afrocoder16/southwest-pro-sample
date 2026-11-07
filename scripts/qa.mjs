// Repeatable QA for the Southwest Pro Painting sample.
//
//   npm run build && npx vite preview --port 4173 &      (terminal 1)
//   npm run qa                                             (terminal 2)
//
// For every route at desktop (1440), tablet (820) and phone (390): full-page screenshot, no horizontal
// overflow, no console errors / failed requests / broken images, zero axe violations (WCAG A + AA).
// Then it scripts every interaction and the site rules:
//   - nothing links off the sample; every estimate button opens the on-site estimate form
//   - forms send NOTHING (no network request) and their confirmation says so
//   - the owner's personal name appears only in the About areas
//   - the fall promo is labelled as a sample offer

import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';
import AxeBuilder from '@axe-core/playwright';

const BASE = process.env.BASE_URL || 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const OUT = path.resolve('qa');
const SHOTS = path.join(OUT, 'screens');
fs.mkdirSync(SHOTS, { recursive: true });

const TEL = 'tel:+13208158216';
const routes = ['/', '/homes', '/business', '/work', '/about', '/estimate', '/contact', '/careers', '/not-a-page'];
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
  return browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.mobile ? 2 : 1,
    isMobile: !!vp.mobile,
    hasTouch: !!vp.mobile,
    ...extra,
  });
}
function watch(page, bucket) {
  page.on('console', (m) => ['error', 'warning'].includes(m.type()) && bucket.push(`${m.type()}: ${m.text()}`));
  page.on('pageerror', (e) => bucket.push(`pageerror: ${e.message}`));
  page.on('requestfailed', (r) => bucket.push(`requestfailed: ${r.url()} ${r.failure()?.errorText}`));
  page.on('response', (r) => r.status() >= 400 && bucket.push(`http ${r.status()}: ${r.url()}`));
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
const bodyTextWithoutAbout = (page) =>
  page.evaluate(() => {
    const clone = document.body.cloneNode(true);
    clone.querySelectorAll('[data-allow-name]').forEach((n) => n.remove());
    return clone.innerText + ' ' + document.title;
  });

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
    const broken = await page.evaluate(() => [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.currentSrc).map((i) => i.currentSrc));
    check(`no broken images  [${tag}]`, broken.length === 0, broken.join(', '));
    const noisy = bucket.filter((b) => !(r === '/not-a-page' && b.includes('404')));
    check(`no console errors or failed requests  [${tag}]`, noisy.length === 0, noisy.join(' | '));
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    check(`axe: 0 violations  [${tag}]`, axe.violations.length === 0, axe.violations.map((v) => `${v.id}(${v.nodes.length}): ${v.nodes[0].target.join(' ')}`).join(' | '));
    check(`exactly one h1  [${tag}]`, (await page.locator('h1').count()) === 1);
    await page.close();
  }
  await ctx.close();
}

// ------------------------------------------------------------------ 2. rules that hold on every page
{
  const ctx = await newCtx(viewports[0]);
  for (const r of routes) {
    const page = await ctx.newPage();
    await page.goto(BASE + r, { waitUntil: 'networkidle' });

    const hrefs = await page.$$eval('a[href]', (as) => as.map((a) => a.getAttribute('href')));
    const external = hrefs.filter((h) => /^https?:\/\//i.test(h));
    check(`no link leaves the sample  [${r}]`, external.length === 0, external.join(', '));
    const tels = hrefs.filter((h) => h.startsWith('tel:'));
    check(`phone links use the published number  [${r}]`, tels.every((t) => t === TEL));
    const est = await page.$$eval('a[data-estimate]', (as) => as.map((a) => a.getAttribute('href')));
    check(`every estimate button opens the on-site form  [${r}]`, est.length >= 2 && est.every((h) => h === '/estimate' || h.endsWith('/estimate')), `${est.length} found`);

    const text = await bodyTextWithoutAbout(page);
    check(`personal name only appears in About areas  [${r}]`, !/\bryan\b|\bschwagel\b/i.test(text) && !(await page.evaluate(() => /\bryan\b|\bschwagel\b/i.test([...document.querySelectorAll('a[href^="mailto:"]')].filter((a) => !a.closest('[data-allow-name]')).map((a) => a.href).join(' ')))));
    await page.close();
  }
  const page = await ctx.newPage();
  await page.goto(BASE + '/about', { waitUntil: 'networkidle' });
  const aboutText = await page.evaluate(() => document.querySelector('[data-allow-name]').innerText);
  check('About page does introduce the owner by name', /Ryan Schwagel/.test(aboutText));
  await page.close();
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
  await page.locator('.finder').getByLabel(/Restaurant or food service/).check({ force: true });
  await page.waitForTimeout(400);
  check('finder: choosing a type changes the photos', (await page.locator('.fan > li').count()) === 3 && /restaurant/i.test(await page.locator('.fan-label').innerText()));
  await page.locator('.finder').getByLabel(/Barn or farm building/).check({ force: true });
  await page.waitForTimeout(300);
  check('finder: barn type shows the barns', (await page.locator('.fan > li').count()) === 4 && (await page.locator('.fan img[alt*="barn" i]').count()) >= 3);
  check('finder: all fan photos have alt text', (await page.locator('.fan img:not([alt]), .fan img[alt=""]').count()) === 0);
  await page.getByRole('link', { name: /See all \d+ photos/ }).click();
  await page.waitForURL(/\/work\?c=home-barn/);
  await page.waitForFunction(() => document.querySelectorAll('.masonry > li').length === 4, null, { timeout: 4000 }).catch(() => {});
  check('finder: "See all" opens the filtered Our work page', (await page.locator('.masonry > li').count()) === 4);
  await page.goBack();
  await page.waitForTimeout(300);
  await page.locator('.pick-link').click();
  await page.waitForURL(/\/estimate$/);
  check('finder: "Not sure?" tile opens the estimate form', (await page.locator('h1').innerText()).includes('free estimate'));

  // fall promo
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  const fall = page.locator('.fall');
  check('promo: fall section sits right under the hero', await fall.isVisible() && (await page.evaluate(() => document.querySelector('.hero').nextElementSibling.classList.contains('fall'))));
  check('promo: labelled as sample offers on the page', /sample offers/i.test(await fall.locator('.sample-pill').innerText()));
  check('promo: three offers', (await fall.locator('.offer').count()) === 3);
  check('promo: year-round estimate message is shown', /free estimates all year round!/i.test(await fall.innerText()));
  check('promo: leaves are decorative (aria-hidden)', (await fall.locator('.leaves[aria-hidden="true"]').count()) === 1);
  await page.locator('[data-estimate="offer-winter-interior"]').click();
  await page.waitForURL(/\/estimate$/);
  check('promo: claiming an offer carries it into the form', /Winter interior refresh/.test(await page.locator('.offer-pill').innerText()) && /Offer: Winter interior refresh \(sample offer\)/.test(await page.locator('textarea[name="details"]').inputValue()));

  // before/after viewer
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.locator('#results').scrollIntoViewIfNeeded();
  await page.waitForTimeout(3200);
  const range = page.locator('#results-viewer .cmp-range');
  const settled = Number(await range.inputValue());
  check('viewer: roller sweeps in and settles near the middle', settled >= 40 && settled <= 60, `value ${settled}`);
  await range.fill('20');
  const clip = await page.locator('#results-viewer .cmp-before').evaluate((el) => el.style.clipPath);
  check('viewer: dragging the roller changes how much "after" shows', /80%/.test(clip), clip);
  check('viewer: range control is labelled for assistive tech', /Drag the roller/.test(await range.getAttribute('aria-label')));
  await page.locator('#results-viewer .cmp-chip', { hasText: 'Kitchen cabinets' }).click();
  check('viewer: choosing another job switches the title', /Kitchen cabinets/.test(await page.locator('#results-viewer .cmp-title').innerText()));
  await page.locator('#results-viewer .cmp-chip', { hasText: 'White barn' }).click();
  await page.waitForTimeout(300);
  check('viewer: angle-mismatched jobs use the Before/After switch instead of a slider', (await page.locator('#results-viewer .cmp-range').count()) === 0 && (await page.locator('#results-viewer .seg').count()) === 1);
  await page.locator('#results-viewer .seg button', { hasText: 'Before' }).click();
  check('viewer: switch shows the before photo', (await page.locator('#results-viewer .cmp').getAttribute('data-shown')) === 'before');
  await page.locator('#results-viewer .seg button', { hasText: 'After' }).click();
  check('viewer: switch shows the after photo', (await page.locator('#results-viewer .cmp').getAttribute('data-shown')) === 'after');
  check('viewer: seven jobs to choose from', (await page.locator('#results-viewer .cmp-chip').count()) === 7);
  check('viewer: every photo has alt text', (await page.locator('#results-viewer img:not([alt])').count()) === 0);

  // reviews
  const rev = () => page.locator('.reviews-stage figure.on blockquote p').innerText();
  check('reviews: five customer comments', (await page.locator('.reviews-stage figure').count()) === 5);
  check('reviews: first one is shown, wording untouched', (await rev()).startsWith('I just found your page. Wow...I never would have guessed our apt looked like this!'));
  await page.getByRole('button', { name: 'Next comment' }).click();
  check('reviews: next shows the second comment', (await rev()).startsWith('Everytime I drive up to my house I smile'));
  await page.getByRole('button', { name: 'Previous comment' }).click();
  await page.getByRole('button', { name: 'Previous comment' }).click();
  check('reviews: previous wraps around to the last comment', (await rev()) === 'Looks awesome good job guys!!');
  await page.waitForTimeout(700);
  const hiddenOnes = await page.locator('.reviews-stage figure:not(.on)').evaluateAll((els) => els.every((e) => getComputedStyle(e).visibility === 'hidden'));
  check('reviews: only the active comment is exposed to assistive tech', hiddenOnes);
  check('reviews: attributed to Facebook and Google, not to a specific one', /Facebook and Google/.test(await page.locator('.reviews-stage figure.on figcaption').innerText()));

  // now hiring + about teaser on home
  check('home: Now hiring band links to the on-site careers page', (await page.locator('.hiring a[href="/careers"]').count()) === 1);
  check('home: About teaser links to the About page', (await page.locator('.about-tease a[href="/about"]').count()) === 1);

  // estimate form: validation, fake data, honest confirmation, no network
  await page.goto(BASE + '/estimate', { waitUntil: 'networkidle' });
  const sent = [];
  page.on('request', (r) => { if (!['document', 'image', 'font', 'stylesheet', 'script'].includes(r.resourceType()) || r.method() !== 'GET') sent.push(`${r.method()} ${r.url()}`); });
  await page.getByRole('button', { name: 'Request my free estimate' }).click();
  check('estimate form: empty submit shows the required-field errors', (await page.locator('.f-err').count()) === 4);
  check('estimate form: focus moves to the first problem', (await page.evaluate(() => document.activeElement?.getAttribute('name'))) === 'first');
  await page.getByRole('button', { name: 'Fill in sample details' }).click();
  check('estimate form: sample details fill the fields', (await page.locator('input[name="email"]').inputValue()) === 'jamie.sample@example.com');
  await page.locator('input[name="phone"]').fill('123');
  await page.getByRole('button', { name: 'Request my free estimate' }).click();
  check('estimate form: a bad phone number is rejected', /10-digit/.test(await page.locator('.f-err').first().innerText()));
  await page.getByRole('button', { name: 'Fill in sample details' }).click();
  sent.length = 0;
  await page.getByRole('button', { name: 'Request my free estimate' }).click();
  await page.waitForSelector('.sent');
  const sentText = await page.locator('.sent').innerText();
  check('estimate form: confirmation says nothing was sent or saved', /Nothing was sent or saved/.test(sentText) && /Sample preview/i.test(sentText));
  check('estimate form: confirmation echoes what was typed', /Jamie Sample/.test(sentText) && /jamie\.sample@example\.com/.test(sentText));
  check('estimate form: submitting made NO network request', sent.length === 0, sent.join(' | '));
  await page.getByRole('button', { name: 'Back to the form' }).click();
  check('estimate form: "Back to the form" returns to the form', (await page.locator('form').count()) === 1);

  // contact + careers
  await page.goto(BASE + '/contact', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Fill in sample details' }).click();
  await page.getByRole('button', { name: 'Send message' }).click();
  await page.waitForSelector('.sent');
  check('contact form: confirmation says nothing was sent or saved', /Nothing was sent or saved/.test(await page.locator('.sent').innerText()));
  await page.goto(BASE + '/careers', { waitUntil: 'networkidle' });
  check('careers: shows the company\'s hiring details', /30–40\+ hours a week/.test(await page.locator('main').innerText()) && /Summer painting crew/.test(await page.locator('main').innerText()));
  await page.getByRole('button', { name: 'Submit application' }).click();
  check('careers form: required fields are enforced', (await page.locator('.f-err').count()) >= 4);
  await page.getByRole('button', { name: 'Fill in sample details' }).click();
  sent.length = 0;
  await page.getByRole('button', { name: 'Submit application' }).click();
  await page.waitForSelector('.sent');
  check('careers form: confirmation says nothing was sent or saved', /Nothing was sent or saved/.test(await page.locator('.sent').innerText()));
  check('careers form: submitting made NO network request', sent.length === 0, sent.join(' | '));
  check('nav: "Now hiring" is in the main menu', (await page.locator('.nav a', { hasText: 'Now hiring' }).count()) === 1);

  // homes: services + process
  await page.goto(BASE + '/homes', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Decks', exact: true }).click();
  check('services: pill toggles on', (await page.getByRole('button', { name: 'Decks', exact: true }).getAttribute('aria-pressed')) === 'true');
  await page.getByRole('tab', { name: 'Interior' }).click();
  check('services: interior list shows the 17 services', (await page.locator('.pills .pill').count()) === 17);
  await page.getByRole('tab', { name: 'Exterior' }).click();
  check('services: exterior list shows the 16 services', (await page.locator('.pills .pill').count()) === 16);
  await page.locator('#estimate').scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  check('services: selection reaches the estimate notes', /Decks/.test(await page.locator('.estimate-card .notes').innerText()));
  check('homes: static six-step process (no animation)', (await page.locator('.steps6 li').count()) === 6);
  check('homes: before/after viewer is present', (await page.locator('#home-results-viewer .cmp').count()) === 1);
  await page.locator('.estimate-card [data-estimate="panel"]').click();
  await page.waitForURL(/\/estimate$/);
  check('notes carry into the estimate form', /Decks/.test(await page.locator('textarea[name="details"]').inputValue()));

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
  await page.locator('#estimate').scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const notes = await page.locator('.estimate-card .notes').innerText();
  check('planner: answers reach the estimate notes', /Exterior walls/.test(notes) && /Ceilings/.test(notes) && /during the work/i.test(notes) && /Storefront, gym or shop/.test(notes), notes.replace(/\n/g, ' | '));

  // work: filters + lightbox + viewer
  await page.goto(BASE + '/work', { waitUntil: 'networkidle' });
  const all = await page.locator('.masonry > li').count();
  await page.getByRole('button', { name: 'Business', exact: true }).click();
  const biz = await page.locator('.masonry > li').count();
  check('work: filter narrows the gallery', biz > 0 && biz < all, `${all} -> ${biz}`);
  check('work: before/after viewer and side-by-side photo are present', (await page.locator('#work-viewer .cmp').count()) === 1 && (await page.locator('img[alt*="Before and after of a house"]').count()) === 1);
  await page.locator('.masonry .chipcard-btn').first().click();
  check('lightbox: opens as a modal dialog', (await page.locator('dialog.lightbox[open]').count()) === 1);
  const cap1 = await page.locator('dialog.lightbox .lb-bar strong').innerText();
  await page.keyboard.press('ArrowRight');
  check('lightbox: arrow key moves to the next photo', cap1 !== (await page.locator('dialog.lightbox .lb-bar strong').innerText()));
  await page.keyboard.press('Escape');
  check('lightbox: Escape closes it', (await page.locator('dialog.lightbox[open]').count()) === 0);

  // keyboard + metadata
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.keyboard.press('Tab');
  check('keyboard: first Tab lands on the skip link', (await page.evaluate(() => document.activeElement?.className)) === 'skip');
  check('metadata: robots noindex present', (await page.locator('meta[name="robots"]').getAttribute('content')) === 'noindex, nofollow');
  check('metadata: no canonical link', (await page.locator('link[rel="canonical"]').count()) === 0);
  check('no console errors during the interaction run', bucket.length === 0, bucket.join(' | '));
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
  check('phone: sticky Free estimate opens the on-site form', (await page.locator('.sticky-est').getAttribute('href')) === '/estimate');
  check('phone: sticky Call uses the published number', (await page.locator('.sticky-call').getAttribute('href')) === TEL);
  const box = await bar.boundingBox();
  check('phone: sticky bar sits at the bottom of the screen', Math.abs(box.y + box.height - vp.height) <= 1);
  await page.evaluate(() => window.scrollTo(0, 3000));
  check('phone: sticky bar still visible after scrolling', await bar.isVisible());
  const small = await page.$$eval('.sticky-bar a, .menu-btn, .pick-body, .pill, .btn, .icon-btn, .seg button', (els) =>
    els.filter((e) => { const r = e.getBoundingClientRect(); return r.width && r.height && (r.height < 44 || r.width < 44); }).map((e) => e.className));
  check('phone: primary tap targets are at least 44px', small.length === 0, small.join(','));
  await page.evaluate(() => window.scrollTo(0, 0));
  const above = await page.locator('.pick').first().boundingBox();
  check('phone: project chooser is on the first screen', above.y + above.height < vp.height - 60);

  await page.locator('.finder').getByLabel(/Storefront, gym or shop/).check({ force: true });
  await page.waitForTimeout(500);
  check('phone: finder swaps the swipe row', (await page.locator('.fan > li').count()) === 3 && (await page.locator('.fan').evaluate((el) => el.scrollWidth > el.clientWidth)));

  // promo stacks and stays readable
  const offerWidths = await page.locator('.fall .offer').evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().width)));
  check('phone: fall offers stack full width', offerWidths.length === 3 && offerWidths.every((w) => w > 300), offerWidths.join(','));

  // viewer is usable by touch
  await page.locator('#results').scrollIntoViewIfNeeded();
  await page.waitForTimeout(3000);
  const rbox = await page.locator('#results-viewer .cmp-range').boundingBox();
  check('phone: before/after roller covers the whole photo (easy to drag)', rbox.width > 300 && rbox.height > 400, `${Math.round(rbox.width)}x${Math.round(rbox.height)}`);
  check('phone: reviews are visible', await page.locator('.reviews-stage figure.on').isVisible());

  await page.getByRole('button', { name: /Menu/ }).click();
  check('phone: menu opens with Now hiring and the estimate button', await page.locator('#mobile-menu').isVisible() && (await page.locator('#mobile-menu a', { hasText: 'Now hiring' }).count()) === 1 && (await page.locator('#mobile-menu a[data-estimate="menu"]').isVisible()));
  await page.locator('#mobile-menu nav a', { hasText: 'Business' }).click();
  await page.waitForURL(/\/business$/);
  await page.waitForSelector('#mobile-menu', { state: 'detached', timeout: 3000 }).catch(() => {});
  check('phone: menu navigates and closes', (await page.locator('#mobile-menu').count()) === 0);

  // estimate form on a phone
  await page.goto(BASE + '/estimate', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Fill in sample details' }).click();
  await page.getByRole('button', { name: 'Request my free estimate' }).click();
  await page.waitForSelector('.sent');
  check('phone: estimate form completes and says nothing was sent', /Nothing was sent or saved/.test(await page.locator('.sent').innerText()));
  check('phone: no console errors', bucket.length === 0, bucket.join(' | '));
  await ctx.close();
}

// ------------------------------------------------------------------ 5. reduced motion
{
  const ctx = await newCtx(viewports[2], { reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await scrollThrough(page);
  const hidden = await page.$$eval('.reveal', (els) => els.filter((e) => getComputedStyle(e).opacity === '0').length);
  check('reduced motion: nothing stays hidden waiting for a scroll animation', hidden === 0, `${hidden} hidden`);
  const leafAnim = await page.locator('.leaf').first().evaluate((el) => getComputedStyle(el).animationName);
  check('reduced motion: falling leaves are switched off', leafAnim === 'none', leafAnim);
  await page.locator('#results').scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  const v = Number(await page.locator('#results-viewer .cmp-range').inputValue());
  check('reduced motion: before/after starts at the middle with no sweep', v === 50, `value ${v}`);
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
