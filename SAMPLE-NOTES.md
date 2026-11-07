# Sample notes: Southwest Pro Painting

Internal notes for Samson. **Not part of the site.** Prepared 6 Nov 2026.

This is a private design sample. Nothing has been published, pushed, or sent to Ryan. His live site was only read
(plain page and photo downloads), and his estimate form was never opened or submitted.

---

## 1. Facts used, and where each came from

Everything below is from Ryan's own site. Nothing was taken from directories or review sites.

| On the sample | Source on southwestpro.com |
| --- | --- |
| Name "Southwest Pro Painting", "Southwest Pro Painting LLC", owner Ryan Schwagel | `/about`, `/contact` |
| Phone 320-815-8216, email ryan@southwestpro.com | `/about`, `/contact` |
| Residential and commercial, interior and exterior, "Southwest Minnesota Area" | home page |
| "We always offer FREE ESTIMATES"; "Ryan will be in touch shortly" | home page, `/estimates` |
| Estimate steps: a time to look at the project, suggestions, detailed proposal with an accurate price before the project begins | `/interior` ("Estimates are free") |
| 17 interior services and 16 exterior services (word for word) | `/interior`, `/exterior` |
| Six exterior process steps (lightly shortened) | `/exterior` ("Our process") |
| "Proper paint coverage and sharp cut lines" | `/interior` |
| Commercial projects: Dairy Queen, Pizza Hut, Cherry Berry (all "Marshall, MN"), Anytime Fitness, Tracy Ambulance Building | `/commercial`, `/about` photo captions |
| Warranty: "stand behind any of our work for two year" | `/commercial` |
| Quality / Reliable mission wording | `/commercial`, `/about` |
| Customer comment from Steve Paxton, Marshall | `/exterior` |
| Hiring page link only (no hiring claims made) | `/applynow` (link) |

Not used, because it could not be verified from his own site: address, hours, founding year, number of employees,
licences or insurance, any review score, any service-area list beyond "Southwest Minnesota".

## 2. What Ryan must confirm before the sample is shared more widely

1. **Which phone number is current.** His site lists **320-815-8216** (used here). A yard sign in one of his photos shows
   a **507.532.44…** number. That photo was cropped so the sign does not appear. Ask which number customers should call.
2. **Permission to reuse his photos publicly** (section 3). Private viewing by Ryan himself is fine. A public link is different.
3. **The two-year warranty.** It is his sentence from the commercial page. Confirm it is current, what it covers, and that
   it applies to homes as well as businesses. The sample words it as "Ryan says … Ask him for the details."
4. **Customer names.** Dairy Queen, Pizza Hut, Cherry Berry, Anytime Fitness and Tracy Ambulance appear as they do on his site.
   Confirm he is happy to name them (and that he is not implying a franchise endorsement) and that "Marshall, MN" is right.
5. **The Steve Paxton comment.** It is on his site, but it is addressed to someone named "Derek", so the sample uses an
   excerpt that stops before that. Confirm it is about his current business and that Mr. Paxton agrees to be named.
6. **Whether the estimate process (look at the project, detailed proposal, price before work) also applies to commercial jobs.**
   His page describes it under *interior* estimates.
7. **"Ryan will be in touch shortly."** His own line. Confirm he wants to keep that promise on a new site.
8. **Home base.** The brief said Marshall, MN. His site says only "Southwest Minnesota", and a BBB listing found in a web
   search showed Worthington and Clarkfield addresses. The sample therefore names no home city. Confirm what he wants stated.
9. **Whether to keep the "now hiring" link.** It points at his existing page and repeats none of his hiring claims.
10. **The logo.** It is redrawn in code (not copied), following his wordmark and colours. Confirm he is fine with that, or
    supply the file and brand rules.

## 3. Photo inventory (24 photos, all from Ryan's own site)

All are processed into `public/work/` (WebP, EXIF and GPS removed). Source files were Wix media on static.wixstatic.com
and were fetched with `npm run photos:fetch`. None is stock. **Ryan has not been asked about any of them.**

| id | Shows | Needs permission or care |
| --- | --- | --- |
| ranch, gray-before, gray-after, gray-backyard, deck, cedar-a, cedar-b, cedar-lake, cabin | Private homes (exteriors) | Homeowners' consent for public use; Ryan to confirm he owns the photos |
| room-accent, room-tray, room-new, ceiling-fan | Private home interiors | Same |
| detail-cut, detail-trim, brushes | Hands, brushes, bucket | A person's hands appear; confirm who took and owns them |
| pizza-hut | Restaurant interior | **Named customer**, brand premises |
| cherry-berry | Frozen-yogurt shop interior | **Named customer**, brand signage, **people visible (a child and an adult)** |
| dairy-queen | Restaurant exterior (low resolution) | **Named customer**, brand, **a person visible** |
| anytime-before | Gym storefront, before | **Named customer**, brand signage, **people visible** |
| corner-before, corner-after | Corner building before/after | A painted "Liquor" sign is visible in "before"; a person is visible at the edge of "after"; customer unnamed on his site |
| ambulance | Tracy Ambulance Building | **Named customer**, signage |
| interior-blue | Large open interior | Customer and location unknown (unlabelled on his site) |

Other notes:

- **Photographer unknown.** Some files on his interior/exterior pages are named like camera files (for example `SAB_6471.JPG`).
  Ask Ryan who took them.
- **Not used on purpose:** a house photo with a visible street number (`1d6ddfcf…`), a man on a ladder (`d5289265…`), a weathered
  house with red door (`ff3dc5e4…`), and the "now hiring" stock image (`41d000_e38a3d12…`, which looks like Wix stock and is
  not Ryan's to reuse elsewhere).
- Each photo's paint-chip colour swatch is sampled from the painted surface in that photo (or matched by eye where the photo
  was too small or shaded to sample); it is decoration, not a paint colour code.
- **Publishing warning:** the sample kit's publish script makes a *public* GitHub repo. That would make every photo above
  publicly downloadable. Get Ryan's permission first, or share the sample only through a private route.

## 4. What is original, what is Ryan's

- **Original (made for this sample):** all code, layout, copy framing, the house illustration, the storefront/interior illustration,
  icons, the favicon and the redrawn wordmark.
- **Ryan's (from his site):** the 24 photos, the service lists, the process steps, the warranty sentence, the comment, contact details.
- **Fonts:** Bricolage Grotesque and Figtree (SIL Open Font License), self-hosted via `@fontsource-variable`.

## 5. Tests run, and what was not verified

Run with `npm run qa` against the production build (154 checks at the time of writing; see the final message for the last result).

Not verified:

- Browsers other than Chrome (Safari, Firefox, Samsung Internet) and real phones. Phone testing used Chrome device emulation.
- Screen readers (axe passes, but a human screen-reader pass has not been done).
- The email draft in real mail apps (only the `mailto:` link contents were checked).
- The estimate form itself. It was never opened or submitted. Only the route's HTTP status and page title were checked.
- Performance on slow real networks (Lighthouse figures, if shown in the final message, are lab numbers on this PC).

## 6. Before using the Midvora sample kit

The stack matches the kit (React + Vite + `react-router-dom`, `BrowserRouter basename={import.meta.env.BASE_URL}`, base path from
`VITE_BASE_PATH`, assets via `asset()`). Tested hosted in a sub-folder (`/southwest-pro-sample/`): pages, images, navigation and
fonts all load. The kit adds its own "unofficial sample" banner; this sample deliberately has none yet (only a footer note).
The client name for the gate would be **Southwest Pro Painting**. Do not run the kit's publish script until the photo permission
question above is settled.
