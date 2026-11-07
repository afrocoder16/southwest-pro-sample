/*
 * Before/after pairs for the roller-reveal viewer. Photos supplied by the project owner (folder ../pics).
 *  mode 'slide': both photos share the same angle, so a drag-to-reveal slider lines up properly.
 *  mode 'flip' : the photos were taken from different angles, so a slider would look wrong;
 *                the viewer swaps between them with a wipe instead and says so.
 * All photos are 3:4 portrait.
 */
export const transforms = [
  {
    id: 'house',
    title: 'Old house, new color',
    tag: 'Exterior',
    mode: 'slide',
    before: 'house-before',
    after: 'house-after',
    beforeAlt: 'Two-story home with faded sage-gray siding and a front porch, before painting',
    afterAlt: 'The same home painted deep blue with white trim',
  },
  {
    id: 'barn',
    title: 'Red barn',
    tag: 'Barn',
    mode: 'slide',
    before: 'barn-before',
    after: 'barn-after',
    beforeAlt: 'Weathered red barn with faded, uneven paint',
    afterAlt: 'The same barn with fresh red paint and crisp white trim',
  },
  {
    id: 'door',
    title: 'Front door',
    tag: 'Stain',
    mode: 'slide',
    before: 'door-before',
    after: 'door-after',
    beforeAlt: 'Wood front door with a worn, faded finish',
    afterAlt: 'The same door with a rich, even stain',
  },
  {
    id: 'kitchen',
    title: 'Kitchen cabinets',
    tag: 'Interior',
    mode: 'slide',
    before: 'kitchen-before',
    after: 'kitchen-after',
    beforeAlt: 'Kitchen with dark reddish-brown wood cabinets',
    afterAlt: 'The same kitchen with white cabinets and a gray island',
  },
  {
    id: 'whitebarn',
    title: 'White barn',
    tag: 'Barn',
    mode: 'flip',
    before: 'whitebarn-before',
    after: 'whitebarn-after',
    beforeAlt: 'White barn with badly peeling paint and scaffolding',
    afterAlt: 'White barn freshly painted, with white trim and a brick lower wall',
    note: 'Taken from slightly different angles.',
  },
  {
    id: 'cedar',
    title: 'Wood siding',
    tag: 'Stain',
    mode: 'flip',
    before: 'cedar-before',
    after: 'cedar-after',
    beforeAlt: 'Wood-sided home with sun-faded siding',
    afterAlt: 'Wood-sided home with warm, freshly stained siding and dark green trim',
    note: 'Taken from different sides of the property.',
  },
  {
    id: 'garage',
    title: 'Red garage',
    tag: 'Barn',
    mode: 'flip',
    before: 'garage-before',
    after: 'garage-after',
    beforeAlt: 'Close view of a red barn-style garage with a painter on a ladder',
    afterAlt: 'The finished red garage with white overhead doors and trim',
    note: 'Taken from different angles.',
  },
];
