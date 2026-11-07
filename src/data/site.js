// Facts used on the site. Everything here comes from Southwest Pro's own website (southwestpro.com)
// as read on 6 Nov 2026, or from the project owner. Nothing is invented. Items marked CONFIRM are
// listed in SAMPLE-NOTES.md. Copy outside the About page must not use the owner's personal name.

export const site = {
  name: 'Southwest Pro Painting',
  legal: 'Southwest Pro Painting LLC', // About page
  owner: 'Ryan Schwagel', // ABOUT PAGE / ABOUT SECTION ONLY
  region: 'Southwest Minnesota', // "Southwest Minnesota Area" on the current home page
  phoneDisplay: '320-815-8216', // CONFIRM: a yard sign in one photo shows a 507 number.
  phoneHref: 'tel:+13208158216',
  email: 'ryan@southwestpro.com', // show only on the About/Contact pages (the address contains a first name)
  warranty: 'two-year', // current Commercial page: "stand behind any of our work for two year". CONFIRM terms.
};

/** The year-round estimate message supplied by the project owner (polished for grammar). */
export const estimateLine = 'Free estimates all year round!';
export const estimateSub = 'Send us a message or submit a free estimate form on our website.';

// Interior service list, exactly as on the current /interior page
export const interiorServices = [
  'Walls',
  'Ceilings',
  'Accent colors',
  'Wall repair',
  'Woodwork',
  'Trim work',
  'Staining & finishing',
  'Cabinets (paint)',
  'Cabinets (stain/clear coat)',
  'Doors',
  'Concrete floors',
  'Wallpaper removal',
  'Texturing',
  'Garages',
  'Existing residential',
  'New home construction/remodels',
  'Faux finishes',
];

// Exterior service list, exactly as on the current /exterior page
export const exteriorServices = [
  'House painting',
  'House staining',
  'Windows & trim',
  'Wood doors (protective coat)',
  'Steel doors',
  'Decks',
  'Fences',
  'Barns & farm buildings',
  'Steel buildings',
  'Playhouses',
  'Shutters',
  'Stucco',
  'Flower boxes',
  'Patio furniture',
  'Brush & roller application',
  'Spray application (at customer request)',
];

// Six-step exterior process, from the current /exterior page ("Our process"). Wording lightly shortened.
export const processSteps = [
  { title: 'Light power wash', text: 'If needed, a light power wash cleans the surface so paint or stain can stick properly.' },
  { title: 'Scrape', text: 'Scraping removes the loose paint.' },
  { title: 'Prime and caulk', text: 'Bare areas get primer, and gaps around windows and doors get caulked.' },
  { title: 'Finish coat', text: 'The finish coat goes on using premium paints of your choice.' },
  { title: 'Clean-up', text: 'Proper clean-up keeps the job site professional.' },
  { title: 'Final walk-around', text: 'A final walk-around with you makes sure expectations are exceeded.' },
];

// Hiring copy: the company's own published wording (current /home "Now hiring" block). CONFIRM it is still current.
export const hiring = {
  headline: 'Come work with us',
  intro: 'We’re hiring full-time help and a summer painting crew.',
  looking: 'We’re looking for detail-oriented, hard-working, self-motivated people. Work experience is preferred but not necessary.',
  hours: '30–40+ hours a week, with bonus opportunities available.',
  roles: ['Full-time painter', 'Summer painting crew'],
};
