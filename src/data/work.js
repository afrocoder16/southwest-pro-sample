import generated from './photos.generated.json';

const BASE = import.meta.env.BASE_URL;

/** URL of a public file, safe for sub-folder hosting. */
export const asset = (path) => `${BASE}${path.replace(/^\//, '')}`;

/** Responsive image props for a photo id (files live in public/work, built by scripts/build-images.mjs). */
export function img(id) {
  const m = generated[id];
  if (!m) throw new Error(`Unknown photo id: ${id}`);
  const largest = m.sizes[m.sizes.length - 1];
  return {
    src: asset(`work/${id}-${largest}.webp`),
    srcSet: m.sizes.map((s) => `${asset(`work/${id}-${s}.webp`)} ${s}w`).join(', '),
    width: m.w,
    height: m.h,
    color: m.color,
  };
}

/*
 * Photo catalogue. Every photo is one of the company's own project photos (from southwestpro.com or supplied by the project owner).
 * `alt` and `caption` describe only what is visible. `customer` is the business name exactly as his own
 * site labels it; those, and any photo showing people, are listed in SAMPLE-NOTES.md for permission.
 */
export const photos = {
  ranch: {
    alt: 'Ranch-style home with tan siding, stone accents and a green front lawn',
    caption: 'Ranch home, siding and trim',
    tag: 'Home · Outside',
  },
  'gray-before': {
    alt: 'Gray siding with peeling paint and white window trim',
    caption: 'Peeling siding, before',
    tag: 'Before',
  },
  'gray-after': {
    alt: 'Small house with clean tan-gray siding, white trim and a white entry door',
    caption: 'Repainted siding, after',
    tag: 'After',
  },
  'gray-backyard': {
    alt: 'Back of a two-story gray home with a patio and flower garden',
    caption: 'Two-story home, exterior',
    tag: 'Home · Outside',
  },
  deck: {
    alt: 'Stained wooden deck and staircase on the side of a gray house',
    caption: 'Stained deck and stairs',
    tag: 'Home · Stain',
  },
  'cedar-a': {
    alt: 'Large cedar-toned home with a tall glass gable among mature trees',
    caption: 'Cedar-toned home',
    tag: 'Home · Stain',
  },
  'cedar-b': {
    alt: 'Wide view of a cedar-stained home with tall glass windows set among trees',
    caption: 'Cedar home, wide view',
    tag: 'Home · Stain',
  },
  'cedar-lake': {
    alt: 'Two-story cedar-stained home with a deck, large windows and a green lawn',
    caption: 'Stained wood home with deck',
    tag: 'Home · Stain',
  },
  cabin: {
    alt: 'Red-brown stained wood building with a picnic table on the lawn',
    caption: 'Stained wood building',
    tag: 'Home · Stain',
  },
  'room-accent': {
    alt: 'Room with a gray-blue wall beside a bold orange accent wall and a window',
    caption: 'Accent wall',
    tag: 'Home · Inside',
  },
  'room-tray': {
    alt: 'Open living space with a tray ceiling painted soft yellow and a kitchen bar',
    caption: 'Tray ceiling, open living space',
    tag: 'Home · Inside',
  },
  'room-new': {
    alt: 'Empty room with freshly painted brown walls and an unfinished floor',
    caption: 'New-construction walls',
    tag: 'Home · Inside',
  },
  'ceiling-fan': {
    alt: 'Tray ceiling with a ceiling fan, painted a warm brown with white trim',
    caption: 'Tray ceiling detail',
    tag: 'Home · Inside',
  },
  'detail-cut': {
    alt: 'A hand cutting a clean paint line along a white wall with an angled brush',
    caption: 'Cutting in a clean line',
    tag: 'Detail',
  },
  'detail-trim': {
    alt: 'A hand painting a bright green wall beside stained wood window trim',
    caption: 'Painting beside wood trim',
    tag: 'Detail',
  },
  brushes: {
    alt: 'Paint-stained brush handles standing in a blue bucket',
    caption: 'Brushes in the bucket',
    tag: 'Detail',
  },
  'pizza-hut': {
    alt: 'Restaurant dining room with wood tables, chairs and a buffet counter',
    caption: 'Pizza Hut, Marshall, MN',
    tag: 'Business · Restaurant',
    customer: 'Pizza Hut',
  },
  'cherry-berry': {
    alt: 'Frozen-yogurt shop interior with a lime-green ceiling, red and green stripes and red lettering on the wall',
    caption: 'Cherry Berry, Marshall, MN',
    tag: 'Business · Restaurant',
    customer: 'Cherry Berry',
  },
  'dairy-queen': {
    alt: 'Dairy Queen restaurant building with a red roof',
    caption: 'Dairy Queen, Marshall, MN',
    tag: 'Business · Restaurant',
    customer: 'Dairy Queen',
  },
  'anytime-before': {
    alt: 'Gym storefront with a painter on a ladder at the entrance, before painting',
    caption: 'Anytime Fitness storefront, before',
    tag: 'Business · Storefront',
    customer: 'Anytime Fitness',
  },
  'corner-before': {
    alt: 'Round corner building partway through repainting, with a painted sign and orange safety fence',
    caption: 'Corner building, before',
    tag: 'Before',
  },
  'corner-after': {
    alt: 'The same round corner building after painting, with even brown stucco walls',
    caption: 'Corner building, after',
    tag: 'After',
  },
  ambulance: {
    alt: 'Large garage building with three overhead doors and a red sign reading Tracy Ambulance',
    caption: 'Tracy Ambulance Building',
    tag: 'Business · Service building',
    customer: 'Tracy Ambulance',
  },
  'interior-blue': {
    alt: 'Large open room with cream walls, a blue band near the ceiling and exercise equipment',
    caption: 'Commercial interior',
    tag: 'Business · Interior',
  },

  // ---- before/after set (added 7 Nov 2026)
  'house-before': {
    alt: 'Two-story home with faded sage-gray siding and a covered front porch, before painting',
    caption: 'Old house, before',
    tag: 'Before',
  },
  'house-after': {
    alt: 'The same two-story home painted deep blue with white trim and a covered front porch',
    caption: 'Old house, painted blue',
    tag: 'Home · Outside',
  },
  'barn-before': {
    alt: 'Weathered red barn with a curved roof and faded, uneven paint, before painting',
    caption: 'Red barn, before',
    tag: 'Before',
  },
  'barn-after': {
    alt: 'Red barn with a curved gray roof, crisp white trim and fresh red paint',
    caption: 'Red barn, repainted',
    tag: 'Home · Barn',
  },
  'door-before': {
    alt: 'Wood front door with a worn, faded finish beside a lantern and a frog statue, before refinishing',
    caption: 'Front door, before',
    tag: 'Before',
  },
  'door-after': {
    alt: 'Wood front door with a rich, even stain beside a lantern and plants',
    caption: 'Front door, refinished',
    tag: 'Home · Stain',
  },
  'kitchen-before': {
    alt: 'Kitchen with dark reddish-brown wood cabinets and island, before painting',
    caption: 'Kitchen cabinets, before',
    tag: 'Before',
  },
  'kitchen-after': {
    alt: 'The same kitchen with white cabinets and a gray island under bright lighting',
    caption: 'Kitchen cabinets, painted white',
    tag: 'Home · Inside',
  },
  'whitebarn-before': {
    alt: 'Large white barn with badly peeling paint, scaffolding and a brick lower wall, before painting',
    caption: 'White barn, before',
    tag: 'Before',
  },
  'whitebarn-after': {
    alt: 'White barn with fresh paint, white trim and a brick lower wall under a blue sky',
    caption: 'White barn, repainted',
    tag: 'Home · Barn',
  },
  'whitebarn-side': {
    alt: 'Side view of a freshly painted white barn with a curved roof and brick lower wall',
    caption: 'White barn, side view',
    tag: 'Home · Barn',
  },
  'cedar-before': {
    alt: 'Wood-sided home with a tall angled window and chimney, with sun-faded orange-brown siding',
    caption: 'Wood siding, before',
    tag: 'Before',
  },
  'cedar-after': {
    alt: 'Two-story home with warm, freshly stained wood siding and dark green trim',
    caption: 'Wood siding, stained',
    tag: 'Home · Stain',
  },
  'garage-before': {
    alt: 'Close view of a red barn-style garage with a painter on a ladder, before painting finished',
    caption: 'Red garage, before',
    tag: 'Before',
  },
  'garage-after': {
    alt: 'Red barn-style garage with two white overhead doors and crisp white trim',
    caption: 'Red garage, repainted',
    tag: 'Home · Barn',
  },
  'social-pair': {
    alt: 'Before and after of a house: dull pink-gray siding on the left, deep navy blue on the right, with a Southwest Pro Painting logo',
    caption: 'Before and after, side by side',
    tag: 'Before / After',
  },
};

/** "What are you painting?" choices. Photos are listed lead-first. Copy never uses a personal name. */
export const projectTypes = [
  {
    id: 'home-exterior',
    audience: 'home',
    label: 'Outside my house',
    hint: 'Siding, trim, windows, doors',
    blurb:
      'House painting, windows and trim, wood and steel doors, shutters, stucco and more. Exterior jobs start with prep: a light wash if needed, scraping, priming and caulking, then the finish coat.',
    photos: ['house-after', 'ranch', 'gray-after', 'gray-backyard', 'cedar-after', 'gray-before'],
  },
  {
    id: 'home-interior',
    audience: 'home',
    label: 'Inside my house',
    hint: 'Walls, ceilings, trim, cabinets',
    blurb:
      'Walls, ceilings, accent colors, trim, cabinets, doors and more. Proper coverage and sharp cut lines are what set our work apart.',
    photos: ['kitchen-after', 'room-accent', 'room-tray', 'room-new', 'ceiling-fan', 'detail-cut'],
  },
  {
    id: 'home-barn',
    audience: 'home',
    label: 'Barn or farm building',
    hint: 'Barns, garages, steel buildings',
    blurb:
      'Barns and farm buildings are on our service list, and these are some of them: red and white barns brought back from faded, peeling paint.',
    photos: ['barn-after', 'whitebarn-after', 'garage-after', 'whitebarn-side'],
  },
  {
    id: 'home-wood',
    audience: 'home',
    label: 'Deck, stain or wood',
    hint: 'Decks, fences, wood, staining',
    blurb:
      'House staining, decks, fences and wood doors are all on our service list. These are stained-wood homes, a front door, a deck and a wood building from our portfolio.',
    photos: ['door-after', 'cedar-lake', 'deck', 'cedar-after', 'cabin', 'cedar-a'],
  },
  {
    id: 'biz-food',
    audience: 'business',
    label: 'Restaurant or food service',
    hint: 'Dining rooms and exteriors',
    blurb:
      'Recent commercial projects include a Dairy Queen, a Pizza Hut and a Cherry Berry, all in Marshall, MN.',
    photos: ['pizza-hut', 'cherry-berry', 'dairy-queen'],
  },
  {
    id: 'biz-store',
    audience: 'business',
    label: 'Storefront, gym or shop',
    hint: 'Exteriors and entrances',
    blurb:
      'An Anytime Fitness storefront and a corner building that went from partly painted to finished, both from our commercial projects.',
    photos: ['anytime-before', 'corner-after', 'corner-before'],
  },
  {
    id: 'biz-service',
    audience: 'business',
    label: 'Garage or service building',
    hint: 'Larger buildings, open rooms',
    blurb:
      'The Tracy Ambulance Building is one of our commercial projects, along with a large open commercial interior.',
    photos: ['ambulance', 'interior-blue'],
  },
];

export const projectById = Object.fromEntries(projectTypes.map((p) => [p.id, p]));

/** A hand-picked, mixed set for the home page before a choice is made. */
export const mixedPicks = ['house-after', 'pizza-hut', 'barn-after', 'room-accent'];

/** Ordered list used by the Our work page (finished results; the before shots live in the viewer). */
export const allPhotoIds = [
  'house-after', 'pizza-hut', 'barn-after', 'room-accent', 'door-after', 'ambulance', 'kitchen-after', 'cedar-lake',
  'whitebarn-after', 'cherry-berry', 'room-tray', 'deck', 'garage-after', 'anytime-before', 'cedar-after', 'ranch',
  'gray-backyard', 'ceiling-fan', 'cabin', 'dairy-queen', 'whitebarn-side', 'room-new', 'cedar-a', 'interior-blue',
  'detail-cut', 'detail-trim', 'cedar-b', 'brushes',
];

export const beforeAfterPairs = [
  {
    id: 'siding',
    title: 'Peeling siding to a clean repaint',
    before: 'gray-before',
    after: 'gray-after',
    note: 'These two photos were taken from different angles.',
    audience: 'home',
  },
  {
    id: 'corner',
    title: 'A corner building, partway through to finished',
    before: 'corner-before',
    after: 'corner-after',
    note: 'These two photos were taken from different angles.',
    audience: 'business',
  },
];
