// GENERATED FROM THE REAL FILES IN public/images — do not hand-edit dimensions.
export type ImageKind = 'wide' | 'port' | 'pano';

export interface ImageAsset {
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly aspect: number;
  readonly kind: ImageKind;
  /** Intrinsic widths actually encoded on disk, ascending. */
  readonly widths: readonly number[];
  /** Average colour, used as a background while the file decodes. */
  readonly dominant: string;
  /** 20px blurred placeholder, inlined so it paints with the HTML. */
  readonly lqip: string;
}

const MANIFEST = {
  '01-hero-cinematic': {
    src: '/images/01-hero-cinematic',
    width: 1672, height: 941, aspect: 1.7768, kind: 'wide',
    widths: [800, 1200, 1672], dominant: '#3a210f',
    lqip: 'data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAAAQBACdASoUAAsAPtFipk0oJiOiMAgBABoJZgAAW4BhlaRS2NkauAPYAAD+9CUjuKHslFzGT+/2rwz/bs5FsiYr2XmYStzdJoDmgbzMBAboug1DgAA=',
  },
  '02-hero-alternative': {
    src: '/images/02-hero-alternative',
    width: 1672, height: 941, aspect: 1.7768, kind: 'wide',
    widths: [800, 1200, 1672], dominant: '#894f2e',
    lqip: 'data:image/webp;base64,UklGRnQAAABXRUJQVlA4IGgAAABwBACdASoUAAsAPtFWo0uoJKMhsAgBABoJaACdMoR3ACnAyr1vdPxnPV1tAADOKx5gOL0q612QM5dYPWS3sfeg7su5Dc5HdaqkCE/hvphj/wRYv234v8jy/68OhnawCaW9CG5Bf0gAAA==',
  },
  '03-red-chilli-powder': {
    src: '/images/03-red-chilli-powder',
    width: 1122, height: 1402, aspect: 0.8003, kind: 'port',
    widths: [560, 840, 1122], dominant: '#690c0b',
    lqip: 'data:image/webp;base64,UklGRooAAABXRUJQVlA4IH4AAABQBQCdASoUABkAPsVQokunpKMhsAwA8BiJbACdMuOCyN2CaRhOexc9/xVW1UaeHYnF3AAA/vV5S0BODuQoopQcmXshCrHy2ddXD1ipvMy2PPXpqY1cHRNJKZIeuFpr/mJQJKDA6Sghcl46e3F41FW+EA6uyHwd/AYvnbh0QAA=',
  },
  '04-turmeric-powder': {
    src: '/images/04-turmeric-powder',
    width: 1122, height: 1402, aspect: 0.8003, kind: 'port',
    widths: [560, 840, 1122], dominant: '#b37915',
    lqip: 'data:image/webp;base64,UklGRqwAAABXRUJQVlA4IKAAAADQBACdASoUABkAPtFUokuoJKMhsAgBABoJZgCdL237MAWR5qmMM2V/xET3FzVxgAD9p723jrLsukOFSPNZ28nMPZZzqM09UDndX/xNtHBytC6H9rsgOZu2zqiVGxCJhJYSveX1dmg50LaBtdom9nYZabanww5Tdsb3stIn+MUtZDweeZiX7i7U3/xDfPFmG/EoJLlMjlzzS4b5rSVI/AAA',
  },
  '05-garam-masala': {
    src: '/images/05-garam-masala',
    width: 1122, height: 1402, aspect: 0.8003, kind: 'port',
    widths: [560, 840, 1122], dominant: '#3c1e1c',
    lqip: 'data:image/webp;base64,UklGRoQAAABXRUJQVlA4IHgAAABQBACdASoUABkAPtFWokuoJKMhsAgBABoJYwCxH2QDTrWV7yiey4IvQ3gAAP7pQkj7c9D3o+r4N7yKaVkg4D12uVdlqtAWoZPtRsVafiRCob5ByoCc+ee1J+NqfkCTgZ9IkvuSJUpyxXbNcm3mc2RsmIf87O8MAAA=',
  },
  '06-coriander-powder': {
    src: '/images/06-coriander-powder',
    width: 1122, height: 1402, aspect: 0.8003, kind: 'port',
    widths: [560, 840, 1122], dominant: '#b5a88c',
    lqip: 'data:image/webp;base64,UklGRpwAAABXRUJQVlA4IJAAAAAwBQCdASoUABkAPtFYpk0oJSOiMBgIAQAaCWMAuwAM30gOrm1QvpSuhuUnOjW7U5M3wAD+kJmkvjvqpWmls/mRjBDAEaf9x08l8lH4h1yfpMf2vjN7fAFRj0vNgQFyxbZoWZhqBrB53mG9+YA/zT7/fZPHUYtj22wqhxXrlKrOHOpVPFrN9lRubRZjpm04AAA=',
  },
  '07-spice-explosion': {
    src: '/images/07-spice-explosion',
    width: 1672, height: 941, aspect: 1.7768, kind: 'wide',
    widths: [800, 1200, 1672], dominant: '#4c230a',
    lqip: 'data:image/webp;base64,UklGRnAAAABXRUJQVlA4IGQAAAAQBACdASoUAAsAPtFUo0uoJKMhsAgBABoJaAC7LwAByYiu5conH4YnYAD+9osW5ub5q56cuH65SzD/f7VPwMbxolF7qI7eLScgy4nP2TxoAxNzu+qopb2lbKCYWL7xVVy8yAAA',
  },
  '08-golden-spice-world': {
    src: '/images/08-golden-spice-world',
    width: 1672, height: 941, aspect: 1.7768, kind: 'wide',
    widths: [800, 1200, 1672], dominant: '#873f07',
    lqip: 'data:image/webp;base64,UklGRm4AAABXRUJQVlA4IGIAAACwBACdASoUAAsAPtFWpEuoJKOhsAgBABoJagCdMoR4T4AAX3kYokZqkn0Ndl8AAP7ukTjQ2fBYM6+33c1uoDMGpNmur1hfrt26n38Y8zswfnZVvNg/Nj8LF4yp6Q3iM5cAAA==',
  },
  '09-aromatic-dark-spices': {
    src: '/images/09-aromatic-dark-spices',
    width: 1672, height: 941, aspect: 1.7768, kind: 'wide',
    widths: [800, 1200, 1672], dominant: '#391f14',
    lqip: 'data:image/webp;base64,UklGRmQAAABXRUJQVlA4IFgAAADwAwCdASoUAAsAPtFWpEuoJKOhsAgBABoJQBOgBD0p0c97XnH8Lz4AAP7s0B0fpwThDGJlNDIgpjG5y3BpPbLUi6W+BhWXX+gGjj/GIhPbjPvkeQlN+wAA',
  },
  '10-indian-cooking': {
    src: '/images/10-indian-cooking',
    width: 1672, height: 941, aspect: 1.7768, kind: 'wide',
    widths: [800, 1200, 1672], dominant: '#543b22',
    lqip: 'data:image/webp;base64,UklGRnIAAABXRUJQVlA4IGYAAAAwBACdASoUAAsAPtFUo0uoJKMhsAgBABoJYgCdMoADUtobb8wI+2fhmMAA9rvTY2AqFrA1zjfmYNi7fuvBTeBjKvCmkeIxh9P1c1mM/AhQ1HQs5FRYUhJE7W20DgoHM4I9UdLNgAA=',
  },
  '11-ingredients-heritage': {
    src: '/images/11-ingredients-heritage',
    width: 1672, height: 941, aspect: 1.7768, kind: 'wide',
    widths: [800, 1200, 1672], dominant: '#835a3a',
    lqip: 'data:image/webp;base64,UklGRmwAAABXRUJQVlA4IGAAAAAwBACdASoUAAsAPtFUo0uoJKMhsAgBABoJZgCdMoR3ACHIKGmJnU1BUUAA/s18bN4ouaLw/ztyS03k35TNRnIumVGwGS5owuAgAaaMu7IbCS8If2cik80IRx5f4lu1gAA=',
  },
  '12-brand-still-life': {
    src: '/images/12-brand-still-life',
    width: 1672, height: 941, aspect: 1.7768, kind: 'wide',
    widths: [800, 1200, 1672], dominant: '#582e1c',
    lqip: 'data:image/webp;base64,UklGRnYAAABXRUJQVlA4IGoAAAAQBACdASoUAAsAPtFUo0uoJKMhsAgBABoJZgCdL1yBz66fyOSSun+eAAD+7FBdeq13dxfQ2Tbm2lZGpaS90KcBUuuegfKulYb6H33tNca37afukknxxhvJwH8tDhVEpVwDFLBD4Y4g4QAA',
  },
  '13-abstract-spice-background': {
    src: '/images/13-abstract-spice-background',
    width: 1672, height: 941, aspect: 1.7768, kind: 'wide',
    widths: [800, 1200, 1672], dominant: '#5f2107',
    lqip: 'data:image/webp;base64,UklGRmwAAABXRUJQVlA4IGAAAACQBACdASoUAAsAPtFUo0uoJKMhsAgBABoJbACdMoR8kQAAcg1rG31r8I1bQYAA/vDUawt9YgA3LDGePnUxduflubKTI/+7JvXRO9pF5W5hd8PmXosJ19327imnD52IAAA=',
  },
  '14-ingredient-panorama': {
    src: '/images/14-ingredient-panorama',
    width: 1915, height: 821, aspect: 2.3325, kind: 'pano',
    widths: [1000, 1600, 1915], dominant: '#a8825d',
    lqip: 'data:image/webp;base64,UklGRmoAAABXRUJQVlA4IF4AAADwAwCdASoUAAkAPtFUo0uoJKMhsAgBABoJYgCxG1yB2706KOoz4RSAAP60LychtCK5luqgoPOOOPGruvbwt96v3rbzX+N371DoBj7+ayU+LdwhoXyhDqJhJ//AAAAA',
  },
  '15-closing-campaign': {
    src: '/images/15-closing-campaign',
    width: 1672, height: 941, aspect: 1.7768, kind: 'wide',
    widths: [800, 1200, 1672], dominant: '#4c2507',
    lqip: 'data:image/webp;base64,UklGRm4AAABXRUJQVlA4IGIAAAAQBACdASoUAAsAPtFUo0uoJKMhsAgBABoJZACdMoRwACmyAHR70uEPYAD+8w2g9kqgoDW1LVn5moT52LsBBPQrW3ep6tpREwEZq8PtbF9PhfrSKaS002uJdL8ETJRP/Gz8AA==',
  },
} as const;

export type AssetKey = keyof typeof MANIFEST;

export const assets: Record<AssetKey, ImageAsset> = MANIFEST;

/** Fallback extension pair — WebP first for every browser that matters, JPEG for the rest. */
export const imageSources = (key: AssetKey) => {
  const a = assets[key];
  const webp = a.widths.map((w) => `${a.src}-${w}.webp ${w}w`).join(', ');
  const jpeg = a.widths.map((w) => `${a.src}-${w}.jpg ${w}w`).join(', ');
  return { webp, jpeg, fallback: `${a.src}-${a.widths[a.widths.length - 1]}.jpg` };
};
