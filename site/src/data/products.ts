import type { AssetKey } from './assets';

export interface Product {
  readonly id: string;
  readonly index: string;
  readonly name: string;
  readonly shortName: string;
  readonly note: string;
  readonly accent: string;
  readonly image: AssetKey;
  readonly detailImage: AssetKey;
  readonly intro: string;
  readonly body: string;
  readonly profile: readonly { label: string; value: string }[];
  readonly pairings: readonly string[];
}

/**
 * Four concept SKUs. The packaging imagery is fictional and was art-directed
 * for this portfolio piece — it is not real product photography.
 */
export const products: readonly Product[] = [
  {
    id: 'red-chilli',
    index: '01',
    name: 'Red Chilli Powder',
    shortName: 'Chilli',
    note: 'Heat, colour, conviction',
    accent: '#E0352B',
    image: '03-red-chilli-powder',
    detailImage: '07-spice-explosion',
    intro: 'The loudest voice in the pantry.',
    body: 'Sun-dried fruit, ground coarse enough to keep its grit. It gives a dish its colour before it gives it heat — which is the point. Bloom it in fat and the whole kitchen changes.',
    profile: [
      { label: 'Aroma', value: 'Sun-dried fruit, warm dust, a clean sting' },
      { label: 'Colour', value: 'Vermilion shifting to deep scarlet' },
      { label: 'Use', value: 'Tadka, marinades, finishing oil' },
    ],
    pairings: ['Turmeric', 'Coriander', 'Mustard seed'],
  },
  {
    id: 'turmeric',
    index: '02',
    name: 'Turmeric Powder',
    shortName: 'Turmeric',
    note: 'Gold that refuses to leave',
    accent: '#E9A11B',
    image: '04-turmeric-powder',
    detailImage: '08-golden-spice-world',
    intro: 'The colour the whole cuisine is built on.',
    body: 'Earthy, resinous, faintly bitter at the edges. It stains the light as much as the plate. Cooked early it softens into a base note; cooked late it stays bright and medicinal.',
    profile: [
      { label: 'Aroma', value: 'Earthy root, resin, bitter orange peel' },
      { label: 'Colour', value: 'Saffron gold, luminous in fat' },
      { label: 'Use', value: 'Dals, broths, pickles, golden rice' },
    ],
    pairings: ['Coriander', 'Cumin', 'Black pepper'],
  },
  {
    id: 'garam-masala',
    index: '03',
    name: 'Garam Masala',
    shortName: 'Garam Masala',
    note: 'Warmth, layered and slow',
    accent: '#C8A24A',
    image: '05-garam-masala',
    detailImage: '09-aromatic-dark-spices',
    intro: 'A blend, not an ingredient.',
    body: 'Cinnamon bark, clove, green cardamom, black pepper — toasted separately, ground together. It is a finishing note rather than a base: added late, it keeps its perfume instead of boiling away.',
    profile: [
      { label: 'Aroma', value: 'Cinnamon bark, clove, green cardamom' },
      { label: 'Colour', value: 'Deep umber with a warm red cast' },
      { label: 'Use', value: 'Braises, curries, roasted vegetables' },
    ],
    pairings: ['Star anise', 'Peppercorn', 'Coriander'],
  },
  {
    id: 'coriander',
    index: '04',
    name: 'Coriander Powder',
    shortName: 'Coriander',
    note: 'The quiet architecture',
    accent: '#7C8A52',
    image: '06-coriander-powder',
    detailImage: '11-ingredients-heritage',
    intro: 'The one nobody notices is doing the work.',
    body: 'Citrus peel and cut hay. It rounds off chilli without cooling it, and gives a masala its body. Ground from pale, ridged seeds — the aroma fades quickly once ground, so it wants to be used.',
    profile: [
      { label: 'Aroma', value: 'Citrus peel, cut hay, faint green' },
      { label: 'Colour', value: 'Pale olive, khaki at the edge' },
      { label: 'Use', value: 'Base of most masalas; also a finisher' },
    ],
    pairings: ['Cumin', 'Turmeric', 'Curry leaf'],
  },
] as const;

/** Used by the ticking index strip and the craft section. */
export const spiceIndex: readonly string[] = [
  'Red Chilli',
  'Turmeric',
  'Coriander',
  'Cumin',
  'Black Pepper',
  'Green Cardamom',
  'Cinnamon',
  'Clove',
  'Star Anise',
  'Mustard Seed',
  'Fennel',
  'Curry Leaf',
  'Saffron',
  'Ginger',
];
