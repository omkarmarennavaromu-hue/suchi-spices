# SUCHI SPICES — "A Universe of Flavour"

Immersive, scroll-driven concept website for a fictional premium Indian spice house.
React 19 · TypeScript · Vite 8 · Tailwind CSS 4 · GSAP ScrollTrigger · Lenis · Lucide

---

## Run it

```bash
cd suchi-spices/site
npm install --legacy-peer-deps   # see "Install note" below
npm run dev                      # http://localhost:5173
```

Production:

```bash
npm run build     # → dist/
npm run preview   # serves dist/ on http://localhost:4173
```

**Install note:** the sandbox's npm 10.8.2 fails to build a dependency tree for Vite 8's
optional peer set (`TypeError: Cannot read properties of null (reading 'edgesOut')`).
`--legacy-peer-deps` resolves it and is what was used to verify this build. On a normal
machine `npm install` should work; use the flag if it does not.

---

## Hero video

The supplied Google Drive file (ID `18fYovk3qbYT_HB4x0B2svcbOx2jojLuK`) **was retrieved
and is in the project**. No manual step is required.

| What | Path |
|---|---|
| Web version (used by the site) | `public/videos/suchi-hero.mp4` |
| Mobile version (≤767px) | `public/videos/suchi-hero-mobile.mp4` |
| Poster (from frame @1.2s) | `public/videos/suchi-hero-poster.jpg` |
| Small poster (mobile) | `public/videos/suchi-hero-poster-sm.jpg` |

Source was 1280×720, 10.01s, 24fps, 6.9 Mbps, **8.8 MB with a silent AAC track**.
It was re-encoded (audio stripped, `+faststart`) to **3.45 MB** — same 1280×720, CRF 25 —
plus a 854×480 / 1.39 MB variant for phones. The original download is kept at
`/home/user/dl/suchi-hero-source.mp4` if you want to re-encode differently.

Implementation: native `<video autoplay muted loop playsInline preload="metadata" poster>`,
`object-fit: cover`, `object-position: 58% center` (mobile) / `62% center` (desktop) to keep
the turmeric burst and chilli in frame. It is decorative (`aria-hidden`, `tabIndex={-1}`,
`disablePictureInPicture`). A rejected autoplay promise is caught; if the file 404s the
`onError` handler swaps in `01-hero-cinematic` — the site never breaks. Under
`prefers-reduced-motion` the video is not rendered at all and the still is used.

⚠️ **The supplied footage contains a small Veo watermark in the bottom-right corner.**
It is subtle in the dark grade but it is there; re-render the source if that matters.

---

## Asset manifest

All 15 campaign images are real files converted to responsive WebP + JPEG at three widths,
generated from `../assets/`. `src/data/assets.ts` is generated from the actual encoded
files — dimensions, aspect, dominant colour and a 20px LQIP per asset.

| # | File stem | Source | Used in |
|---|---|---|---|
| 01 | `01-hero-cinematic` | 1672×941 | Hero fallback / reduced-motion still |
| 02 | `02-hero-alternative` | 1672×941 | Journey scene 04 — "The whole universe" |
| 03 | `03-red-chilli-powder` | 1122×1402 | Product 01 + modal |
| 04 | `04-turmeric-powder` | 1122×1402 | Product 02 + modal |
| 05 | `05-garam-masala` | 1122×1402 | Product 03 + modal |
| 06 | `06-coriander-powder` | 1122×1402 | Product 04 + modal |
| 07 | `07-spice-explosion` | 1672×941 | Journey scene 01 + chilli modal plate |
| 08 | `08-golden-spice-world` | 1672×941 | Journey scene 02 + turmeric modal plate |
| 09 | `09-aromatic-dark-spices` | 1672×941 | Journey scene 03 + garam masala modal plate |
| 10 | `10-indian-cooking` | 1672×941 | §05 Cooking |
| 11 | `11-ingredients-heritage` | 1672×941 | §01 Manifesto + §06 Craft still life |
| 12 | `12-brand-still-life` | 1672×941 | §07 Brand campaign |
| 13 | `13-abstract-spice-background` | 1672×941 | §04 Flavour in motion |
| 14 | `14-ingredient-panorama` | 1915×821 | §06 Craft panorama band |
| 15 | `15-closing-campaign` | 1672×941 | §08 Final CTA |

Brand palette in `:root` (`src/styles/globals.css`): ink `#0B0607`, burgundy `#4A0F15`,
scarlet `#E0352B`, vermilion `#C1121F`, saffron `#E9A11B`, burnt `#B85C1E`,
ivory `#F3E8D8`, gold `#C8A24A`, coriander `#5E6B3F`.

Type: **Archivo** (variable, display), **Inter** (body), **Instrument Serif** (italic
accent) — all self-hosted in `public/fonts/`, preloaded, no external requests.

---

## What is built

**§00 Hero** — full-viewport video, masked line-by-line headline reveal on a staged
timeline (nav → eyebrow → headline → copy → CTAs → meta), scroll-out where the copy leaves
before the headline while the media scales. Fits exactly one screen at 375, 390, 768,
1280×800, 1366×768, 1440×900, 1920×1080.

**§01 Manifesto** — ivory break overlapping the hero by 3.5vh, clip-path image reveal with
interior parallax, line-masked heading, spice marquee index strip.

**§02 Journey** — desktop: pinned 100svh, 4 scenes, `clip-path` wipe between layers with
counter-scaling of each photograph, live counter + 4 tick marks + progress rail.
Mobile and reduced-motion: natural-flow stacked scenes, no pin.

**§03 Collection** — asymmetric 12-column editorial grid (6/4/5/4 spans, offset starts, 4:5
portraits), pointer-follow parallax capped at ±12px, hover zoom, accent rule draw,
focus-visible parity. Click opens a drawer with focus trap, Escape, backdrop click, focus
restore and scroll lock.

**§04 Flavour in motion** — burgundy-deep interlude, asymmetric split, oversized ghost
wordform drifting against scroll, masked image reveal, saffron rule.

**§05 Cooking** — ivory editorial two-column with the tarka photograph, inset clip reveal,
three-step temper/bloom/layer index.

**§06 Craft** — layered still life with an offset figure, a 21:9 panorama band with
counter-scroll and a four-zone colour index.

**§07 Campaign** — full-bleed range hero, scroll-scrubbed image scale, bottom-anchored type.

**§08 Final CTA** — curtain clip-path reveal on approach (opens by 62% of the way in, so it
is never a screen of black), centred CTA, radial saffron glow.

**Footer** — dynamic year, real section anchors, back-to-top, concept disclosure.

Motion is GSAP + ScrollTrigger only; Lenis is driven from the GSAP ticker and ScrollTrigger
is refreshed on `document.fonts.ready` and `load`. Every effect passes through
`gsap.context()` and is reverted on unmount (StrictMode-safe). CSS transitions handle all
hover/focus states.

---

## Verified (actually tested, not assumed)

Headless Chromium via Playwright against the **production build**:

- **Zero console errors / warnings, zero page errors** at 1440 desktop and 390 mobile.
- **No horizontal overflow** at 375, 390, 768, 1280, 1366, 1440, 1920.
- Hero fits the viewport exactly at all seven sizes above.
- Video: `readyState 4`, `paused: false`, correct intrinsic size on desktop (1280×720) and
  mobile (854×480). Only one `<video>` on the page.
- All 15 images load (`naturalWidth > 0`), all have alt text, no nameless buttons.
- Modal: opens, focus lands on "Close product details", Escape closes it.
- Mobile menu: opens, `aria-hidden` flips, touch targets ≥ 40px.
- Section anchors land 104px from the top under the 93px sticky header — including past the
  pinned journey section (pin-spacer aware).
- `prefers-reduced-motion`: video element absent, still image used, headline fully visible
  at opacity 1, journey falls back to stacked layout.
- Keyboard: skip link first in tab order, 2px saffron focus ring (`rgb(233,161,27)`)
  confirmed after the transition settles.
- No-JS: `<noscript>` brand statement renders.
- `tsc -b` clean, `vite build` clean (47.5 kB CSS / 428 kB JS, 138 kB gzipped).

Screenshot evidence in `../audit/`.

## Not verified / known limitations

- **Safari, Firefox and real iOS/Android hardware were not available** — only headless
  Chromium. iOS `playsInline` behaviour and Safari's video autoplay heuristics are
  implemented per spec but untested on a real device.
- Lenis smooth scroll was exercised only through scripted scrolling; a trackpad/touch
  feel check is worth doing by hand.
- Source images are 1672px wide. Fine for this build; for a 4K hero you would want higher
  resolution masters.
- The product photography inside the pack labels is AI-generated concept art — the small
  body copy on the pouches is decorative, not real text.
