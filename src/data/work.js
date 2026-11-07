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
 * Photo catalogue. Every photo is one of Ryan's own project photos as published on southwestpro.com.
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
};

/** "What are you painting?" choices. Photos are listed lead-first. */
export const projectTypes = [
  {
    id: 'home-exterior',
    audience: 'home',
    label: 'Outside my house',
    hint: 'Siding, trim, windows, doors',
    blurb:
      'Ryan lists house painting, windows and trim, wood and steel doors, shutters, stucco and more. His exterior process starts with prep: a light wash if needed, scraping, priming and caulking, then the finish coat.',
    photos: ['ranch', 'gray-after', 'gray-backyard', 'cedar-lake', 'deck', 'gray-before'],
  },
  {
    id: 'home-interior',
    audience: 'home',
    label: 'Inside my house',
    hint: 'Walls, ceilings, trim, cabinets',
    blurb:
      'Walls, ceilings, accent colors, trim, cabinets, doors and more. Ryan says proper coverage and sharp cut lines are what set his work apart.',
    photos: ['room-accent', 'room-tray', 'room-new', 'ceiling-fan', 'detail-cut', 'detail-trim'],
  },
  {
    id: 'home-wood',
    audience: 'home',
    label: 'Deck, stain or wood',
    hint: 'Decks, fences, wood, staining',
    blurb:
      'House staining, decks, fences and wood doors are all on Ryan’s service list. These are stained-wood homes, a deck and a wood building from his own portfolio.',
    photos: ['cedar-lake', 'deck', 'cedar-a', 'cabin', 'cedar-b'],
  },
  {
    id: 'biz-food',
    audience: 'business',
    label: 'Restaurant or food service',
    hint: 'Dining rooms and exteriors',
    blurb:
      'Recent commercial projects on Ryan’s site include a Dairy Queen, a Pizza Hut and a Cherry Berry, all in Marshall, MN.',
    photos: ['pizza-hut', 'cherry-berry', 'dairy-queen'],
  },
  {
    id: 'biz-store',
    audience: 'business',
    label: 'Storefront, gym or shop',
    hint: 'Exteriors and entrances',
    blurb:
      'An Anytime Fitness storefront and a corner building that went from partly painted to finished, both from Ryan’s commercial projects.',
    photos: ['anytime-before', 'corner-after', 'corner-before'],
  },
  {
    id: 'biz-service',
    audience: 'business',
    label: 'Garage or service building',
    hint: 'Larger buildings, open rooms',
    blurb:
      'The Tracy Ambulance Building is one of the commercial projects Ryan shows, along with a large open commercial interior.',
    photos: ['ambulance', 'interior-blue'],
  },
];

export const projectById = Object.fromEntries(projectTypes.map((p) => [p.id, p]));

/** A hand-picked, mixed set for the home page before a choice is made. */
export const mixedPicks = ['ranch', 'pizza-hut', 'room-accent', 'cedar-lake'];

/** Ordered list used by the Our work page. */
export const allPhotoIds = [
  'ranch',
  'pizza-hut',
  'room-accent',
  'cedar-lake',
  'ambulance',
  'room-tray',
  'deck',
  'cherry-berry',
  'gray-backyard',
  'anytime-before',
  'ceiling-fan',
  'cabin',
  'dairy-queen',
  'room-new',
  'cedar-a',
  'interior-blue',
  'detail-cut',
  'detail-trim',
  'cedar-b',
  'brushes',
];

export const beforeAfterPairs = [
  {
    id: 'siding',
    title: 'Peeling siding to a clean repaint',
    before: 'gray-before',
    after: 'gray-after',
    note: 'Ryan’s exterior page shows these two photos as a before and after. They were taken from different angles.',
    audience: 'home',
  },
  {
    id: 'corner',
    title: 'A corner building, partway through to finished',
    before: 'corner-before',
    after: 'corner-after',
    note: 'Ryan’s commercial page shows these two photos as a before and after. They were taken from different angles.',
    audience: 'business',
  },
];
