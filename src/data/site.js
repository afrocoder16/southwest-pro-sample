// Facts used on the site. Everything here comes from Ryan's own website (https://www.southwestpro.com/)
// as read on 6 Nov 2026. Nothing is invented. Items marked CONFIRM are listed in SAMPLE-NOTES.md.

export const site = {
  name: 'Southwest Pro Painting',
  legal: 'Southwest Pro Painting LLC', // About page
  owner: 'Ryan Schwagel', // About and Contact pages
  region: 'Southwest Minnesota', // "Southwest Minnesota Area" on the home page
  phoneDisplay: '320-815-8216', // About and Contact pages. CONFIRM: a yard sign in his photos shows a 507 number.
  phoneHref: 'tel:+13208158216',
  email: 'ryan@southwestpro.com',
  estimateUrl: 'https://www.southwestpro.com/estimates', // his existing free-estimate route
  hiringUrl: 'https://www.southwestpro.com/applynow', // his existing hiring page (no hiring claims are made here)
  liveSite: 'https://www.southwestpro.com/',
  warranty: 'two-year', // Commercial page: "stand behind any of our work for two year". CONFIRM terms.
};

// Ryan's interior service list, exactly as on https://www.southwestpro.com/interior
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

// Ryan's exterior service list, exactly as on https://www.southwestpro.com/exterior
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

// Ryan's six-step exterior process, from https://www.southwestpro.com/exterior ("Our process").
export const processSteps = [
  {
    title: 'Light power wash',
    text: 'If needed, a light power wash cleans the surface so paint or stain can stick properly.',
  },
  { title: 'Scrape', text: 'Scraping removes the loose paint.' },
  {
    title: 'Prime and caulk',
    text: 'Bare areas get primer, and gaps around windows and doors get caulked.',
  },
  { title: 'Finish coat', text: 'The finish coat goes on using premium paints of your choice.' },
  { title: 'Clean-up', text: 'Proper clean-up keeps the job site professional.' },
  {
    title: 'Final walk-around',
    text: 'A final walk-around with you makes sure expectations are exceeded.',
  },
];

// The one testimonial on Ryan's site (exterior page). Shown as an excerpt; the full text also thanks
// someone named "Derek", so the excerpt stops before that. CONFIRM permission to reuse with Mr. Paxton.
export const testimonial = {
  quote:
    'We want to commend you all on the fine job you did in painting our house. We were impressed with your workmanship … attention to detail is important, and we could definitely see that quality come through in your work!',
  who: 'Steve Paxton, Marshall',
  source: 'As published on southwestpro.com',
};
