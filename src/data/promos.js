/*
 * SAMPLE fall and winter offers. The percentages, dollar amounts and dates are placeholders so the design
 * can be seen; the site labels them "Sample offers". Real offers and terms are for Southwest Pro to decide.
 *
 * The pattern follows what painting companies commonly run in autumn (researched 7 Nov 2026):
 *  - winter interior specials for projects booked in the slow months (for example Dec to Feb)
 *  - "pick two projects, save a flat amount" bundles
 *  - early-booking savings on next spring's exterior work
 *  - free color consultation with an interior estimate
 *  - "mention the offer at your free estimate" redemption
 */
export const fallOffers = [
  {
    id: 'winter-interior',
    chip: 'Harvest Gold',
    color: '#d79a2b',
    ink: true,
    title: 'Winter interior refresh',
    big: '10% off',
    body: 'Interior painting scheduled between December and February. Walls, ceilings, trim, cabinets and doors all count.',
    when: 'Sample offer · Dec to Feb projects',
  },
  {
    id: 'pick-two',
    chip: 'Pumpkin',
    color: '#e8742e',
    ink: true,
    title: 'Pick two, save',
    big: '$200 off',
    body: 'Bundle any two interior projects, like walls and trim, or cabinets and doors, and save on the pair.',
    when: 'Sample offer · ends Feb 28',
  },
  {
    id: 'spring-early',
    chip: 'Cranberry',
    color: '#a3322f',
    ink: false,
    title: 'Book spring early',
    big: '5% off',
    body: 'Get your free exterior estimate before March 31 and save on spring painting: siding, decks, barns and more.',
    when: 'Sample offer · estimate by Mar 31',
  },
];

export const fallPerk = 'Free color consultation with every interior estimate';
