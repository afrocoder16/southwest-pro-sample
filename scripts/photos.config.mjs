// Source inventory for every photo used in this sample.
// All of these are Ryan's own project photos as published on https://www.southwestpro.com/
// They are used here for a PRIVATE design sample only. See SAMPLE-NOTES.md for the permission list.
// `wix` is the media id on static.wixstatic.com (the original, un-resized file).
// `crop` is optional, as fractions of the oriented image: [left, top, width, height].
// `color` overrides the sampled swatch where the photo is too shaded/small to sample reliably (hand-matched by eye).
// `swatch` is a point [x, y] (fractions of the cropped image) on the PAINTED surface; the paint-chip colour is averaged there.

export const photos = [
  // ---- Homes: exterior
  { id: 'ranch',          wix: 'dc6511_44cb6902ac4d43bda6502b9dcd6ce085.jpg', swatch: [0.88, 0.45], color: '#b3a384' },
  { id: 'gray-before',    wix: 'dc6511_3a67d178e33a48da8fbec3adc48a0447.jpg', swatch: [0.88, 0.6] },
  { id: 'gray-after',     wix: 'dc6511_007017d9de304bfb998e7f4f8b07c1d3.jpg', swatch: [0.25, 0.45] },
  { id: 'gray-backyard',  wix: 'dc6511_e5b814138aba4589be9960fbb6441bd2.jpg', swatch: [0.54, 0.35] },
  { id: 'deck',           wix: 'dc6511_368769392c564500bf4f40c613a41635.jpg', swatch: [0.36, 0.27] },
  { id: 'cedar-a',        wix: 'dc6511_2d7b11894997487abe5e1040d22898bb~mv2.jpg', swatch: [0.3, 0.36], color: '#9a5a3c' },
  { id: 'cedar-b',        wix: 'dc6511_2e203e7411154bf685c5d137d44029eb~mv2.jpg', swatch: [0.48, 0.39] },
  // Cropped on purpose: the original shows a yard sign with a phone number that differs from the website's.
  { id: 'cedar-lake',     wix: 'dc6511_9db17b428d49463dbf0d25aa56235170.jpg', swatch: [0.29, 0.58], crop: [0, 0, 1, 0.64] },
  { id: 'cabin',          wix: 'dc6511_a05208c5cfef4dc3a3e1697f4d67b57c.jpg', swatch: [0.14, 0.42] },
  // ---- Homes: interior and detail
  { id: 'room-accent',    wix: 'dc6511_cd5183509bd44b569f0ef3c2f087aa30.jpg', swatch: [0.58, 0.4] },
  { id: 'room-tray',      wix: 'dc6511_2ec956a6bd0f466ca45fe770e311e234.jpg', swatch: [0.23, 0.26] },
  { id: 'room-new',       wix: 'dc6511_66120f49ce7245548263357082414418.jpg', swatch: [0.5, 0.35] },
  { id: 'ceiling-fan',    wix: 'dc6511_59efdf264fc841478559f87c81fb8deb.jpg', swatch: [0.3, 0.3] },
  { id: 'detail-cut',     wix: 'dc6511_80354aec97fb47b081217c250b6c1228.jpg', swatch: [0.2, 0.3] },
  { id: 'detail-trim',    wix: 'dc6511_26064f66ec784e229e688e65a53c55a1.jpg', swatch: [0.92, 0.28] },
  { id: 'brushes',        wix: 'dc6511_4248d762475b4ccaac2a6bae4081baee.jpg', swatch: [0.1, 0.5] },
  // ---- Business
  { id: 'pizza-hut',      wix: 'dc6511_bd07379f2b3a4b9c864c6d7a90ea251f.jpg', swatch: [0.3, 0.17], color: '#b58a55' },
  { id: 'cherry-berry',   wix: 'dc6511_11753cedc0e94a33c4d673ceadff6031.jpg', swatch: [0.7, 0.18] },
  { id: 'dairy-queen',    wix: 'dc6511_a981e2c4ed0b0619f0468d82758a3f85.jpg', swatch: [0.45, 0.38] },
  { id: 'anytime-before', wix: 'dc6511_a8d837cb8529434b9d351fed81a3e604.jpg', swatch: [0.8, 0.2] },
  { id: 'corner-before',  wix: 'dc6511_361ad722579a44208b1aff613067fd5e.jpg', swatch: [0.62, 0.45] },
  { id: 'corner-after',   wix: 'dc6511_109a4f27b5fd4f66b8a36c28a95b1578.jpg', swatch: [0.28, 0.5] },
  { id: 'ambulance',      wix: 'dc6511_36953c5da0c84f15aa8c2cad3ec47fff.jpg', swatch: [0.9, 0.42] },
  { id: 'interior-blue',  wix: 'dc6511_d7abd893339b43808e7a49d0e6b63933.jpg', swatch: [0.25, 0.5] },

  // ---- Added 7 Nov 2026: before/after photos supplied by the project owner (folder ../pics, left untouched).
  // `local` is a path relative to the web folder. The id is the clearer name used on the site.
  { id: 'house-before',       local: '../pics/before6.jpg',   color: '#9b9578' },
  { id: 'house-after',        local: '../pics/after6.png',    color: '#3f5877' },
  { id: 'barn-before',        local: '../pics/before4.1.jpg', color: '#8f3a33' },
  { id: 'barn-after',         local: '../pics/after4.3.png',  color: '#b3322c' },
  { id: 'door-before',        local: '../pics/before2.jpg',   color: '#8a5a3a' },
  { id: 'door-after',         local: '../pics/after2.png',    color: '#a0612c' },
  { id: 'kitchen-before',     local: '../pics/before1.jpg',   color: '#9a4a2a' },
  { id: 'kitchen-after',      local: '../pics/after1.jpg',    color: '#e8e4dc' },
  { id: 'whitebarn-before',   local: '../pics/before5.jpg',   color: '#cfcac0' },
  { id: 'whitebarn-after',    local: '../pics/after5.png',    color: '#f0f0ee' },
  { id: 'whitebarn-side',     local: '../pics/after5.1.png',  color: '#f0f0ee' },
  { id: 'cedar-before',       local: '../pics/before3.jpg',   color: '#c47a38' },
  { id: 'cedar-after',        local: '../pics/after3.png',    color: '#bf6f2e' },
  { id: 'garage-before',      local: '../pics/before4.2.jpg', color: '#8e2a2b' },
  { id: 'garage-after',       local: '../pics/after4.4.png',  color: '#b02a28' },
  { id: 'social-pair',        local: '../pics/pics.jpg',      color: '#3f5877' },
];

export const widths = [480, 960, 1600];
