# Southwest Pro Painting: private design sample

A private concept for **Southwest Pro Painting** (owner: Ryan Schwagel), showing one way the company could present
itself online. It is **not** the live website and it is **not published anywhere**. The business's real site is
<https://www.southwestpro.com/>.

Read [`SAMPLE-NOTES.md`](SAMPLE-NOTES.md) before sharing it: it lists every fact, photo and name taken from Ryan's
site and everything he must confirm.

## The idea

The home page opens with one question, **"What are you painting?"**, and six tappable answers (three for homes,
three for businesses). Each answer swaps in Ryan's real jobs that look like it, so a homeowner and a business manager
each see relevant proof in one tap. Every page ends in the same next step: his existing free-estimate form, a phone
call, or an email draft. On phones a Call / Free estimate bar stays at the bottom of every screen.

| Page | What it does |
| --- | --- |
| `/` Home | The finder, the two paths, the **Prep Lab**, recent work, estimate panel |
| `/homes` | Ryan's exact interior and exterior service lists (tap to add to your notes), Prep Lab, before/after, photos, customer comment |
| `/business` | Property-type tabs with his named commercial jobs, Quality / Reliable / Warranty, the **walk-through planner**, before/after |
| `/work` | Filterable gallery with a keyboard-friendly lightbox |
| `/about` | Ryan, the company, contact details, a link to his hiring page |

**Prep Lab:** an original illustration of a house that steps through Ryan's six published exterior steps (wash, scrape,
prime and caulk, finish coat, clean-up, final walk-around), with a colour try-on. Real before/after photos light up beside it.
**Walk-through planner:** an original storefront/interior illustration; tick what needs paint and answer three questions.

## Honesty rules this sample follows

- Every estimate button goes to Ryan's existing route, `https://www.southwestpro.com/estimates`, in a new tab.
- **No form sends anything.** The planner and colour try-on only fill an *email draft* (a `mailto:` link the visitor chooses to open) and the on-page notes; the page says so.
- No invented reviews, prices, warranties, schedules, service areas or hiring claims. The warranty line and customer comment are Ryan's own words from his site.
- Photos are Ryan's own, from his site, for this private sample only (see the notes). Illustrations are original.
- `noindex, nofollow`, no canonical link, no analytics, no third-party requests (fonts are self-hosted).

## Run it

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # production build into dist/
npx vite preview     # serve the production build
```

Photos are already optimised in `public/work/`. To rebuild them from Ryan's site (read-only downloads):
`npm run photos:fetch && npm run photos:build` (originals go to the git-ignored `.cache/`, GPS/EXIF data is stripped).

## Test it

```bash
npm run build && npx vite preview --port 4173      # terminal 1
npm run qa                                         # terminal 2
```

`scripts/qa.mjs` drives Chrome through every route at 1440 / 820 / 390 px: screenshots, horizontal overflow, console
errors, broken images, axe accessibility (WCAG A/AA), then every interaction (finder, Prep Lab, services, planner, gallery,
lightbox, mobile menu, sticky bar, estimate/call/email links, reduced motion). Requests to southwestpro.com are stubbed
in the browser so the test never loads Ryan's site or touches his form. Screenshots and a JSON report land in `qa/`
(git-ignored).

## Hosting notes

The stack is React + Vite + `react-router-dom` with `BrowserRouter basename={import.meta.env.BASE_URL}`, as the Midvora sample kit requires.
`VITE_BASE_PATH` sets the sub-folder for hosts such as GitHub Pages (tested). Image URLs go through `asset()` in
`src/data/work.js`. This layout matches what the Midvora sample kit expects.

## Stack

React 19 · Vite · react-router-dom 7 · `@fontsource-variable` (Bricolage Grotesque, Figtree), self-hosted · plain CSS
with design tokens (`src/styles`) · `sharp` for photo processing (dev only) · `playwright-core` + `@axe-core/playwright` for QA (dev only).
