# Southwest Pro Painting: private design sample

A private concept for **Southwest Pro Painting**, showing one way the company could present itself online. It is **not** the
live website and it is an unofficial sample hosted on GitHub Pages behind a Midvora visitor gate. Nothing in it links to the real site, and none of its forms send anything.

Read [`SAMPLE-NOTES.md`](SAMPLE-NOTES.md) before sharing it. It lists every fact, photo and name used, the placeholder offers, and
everything the owner must confirm.

## The idea

The home page opens with one question, **"What are you painting?"**, and tappable answers for homes, barns and businesses. Each
answer swaps in the company's real jobs that look like it. Every page ends in the same next step: a free estimate form, a call, or
a message, and on phones a Call / Free estimate bar stays at the bottom of every screen.

| Page | What it does |
| --- | --- |
| `/` Home | Finder, **fall offers**, two paths, **before/after viewer + customer reviews**, recent work, **meet the owner**, **now hiring**, estimate panel |
| `/homes` | Service lists (tap to add to your notes), before/after + reviews, six-step process, inside / barn / stain galleries |
| `/business` | Property-type tabs with named commercial jobs, Quality / Reliable / Warranty, the walk-through planner |
| `/work` | Filterable gallery, lightbox, before/after viewer |
| `/about` | The company, the owner (the only place his name appears besides the home teaser), contact, now hiring |
| `/estimate` `/contact` `/careers` | On-site forms (estimate, message, job application) |

**Roller-reveal viewer:** drag the orange roller across a before/after to "paint in" the after. Jobs shot from different
angles use a Before/After switch with a wipe instead. **Fall offers:** autumn paint-chip cards, labelled "Sample offers".

## Rules this sample follows

- **No outbound links.** Every estimate button opens `/estimate` on this site.
- **No form sends anything.** They validate, offer "Fill in sample details" (fake data), and end in a confirmation that says
  *Nothing was sent or saved*. No network request is made.
- **The owner's personal name only appears in the About areas.** Elsewhere: "Southwest Pro", "we", "our".
- No invented reviews, warranties, schedules, service areas or hiring claims. Customer comments came from the project owner; the
  warranty, hiring details and quotes are the company's own published words. **The fall offers are placeholders and say so.**
- `noindex, nofollow`, no canonical link, no analytics, no third-party requests (fonts are self-hosted).

## Run it

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # production build into dist/
npx vite preview     # serve the production build
```

Photos are already optimised in `public/work/`. To rebuild them: `npm run photos:fetch && npm run photos:build` (website photos are
downloaded read-only into the git-ignored `.cache/`; the supplied before/after photos are read from `../pics`; EXIF/GPS is stripped).

## Test it

```bash
npm run build && npx vite preview --port 4173      # terminal 1
npm run qa                                         # terminal 2  (writes qa/report.json and qa/screens)
node scripts/previews.mjs                          # named screenshots into qa/previews
```

`scripts/qa.mjs` drives Chrome through every route at 1440 / 820 / 390 px (overflow, console errors, broken images, axe WCAG A/AA)
and then every interaction and rule above: finder, fall promo, viewer, reviews, all three forms, name rule, no outbound links,
services, planner, gallery, lightbox, mobile menu, sticky bar and reduced motion.

## Hosting notes

React + Vite + `react-router-dom` with `BrowserRouter basename={import.meta.env.BASE_URL}`, as the Midvora sample kit requires.
`VITE_BASE_PATH` sets a sub-folder for hosts such as GitHub Pages (tested). Image URLs go through `asset()` in `src/data/work.js`.

## Stack

React 19 · Vite · react-router-dom 7 · static `@fontsource` fonts (Bricolage Grotesque, Figtree), self-hosted · plain CSS with
design tokens (`src/styles`) · `sharp` for photo processing (dev only) · `playwright-core` + `@axe-core/playwright` for QA (dev only).
