# SUCHI SPICES — "A Universe of Flavour"
### Campaign art direction & asset system · Vol. 01

**Deliverable:** 15 standalone, high-resolution campaign assets for an immersive, scroll-animated brand site.
**Status:** ✅ Complete — all 15 assets rendered, graded and catalogued.
**Rule of the collection:** one lighting logic, one colour grade, one typographic hierarchy. Nothing in the set may contradict another frame.

**File specs:** landscape plates at 1672 × 941 (16:9), panorama at 1915 × 821 (21:9), product portraits at 1122 × 1402 (4:5). All JPEG, sRGB. Full-resolution originals live in `assets/`; `preview/` holds web-weight derivatives for the index page.

---

## 1. The idea

Indian spice advertising usually sells heat. This brand sells **a universe** — a physical space you travel through. Powder behaves like nebula dust, whole spices float like bodies in orbit, and the camera is always *inside* the cloud rather than looking at it from outside.

Three consequences drive every frame:

1. **Depth is the product.** Every image has at least three tonal planes — a sharp foreground element, a working mid-ground subject, and a background that dissolves. Flat lay-outs are rejected on sight.
2. **Light is single-source and motivated.** One key, raking, warm. Fill never exceeds the key. Rim lights are warm gold and used only to separate ingredient silhouettes from dark backgrounds.
3. **Negative space is deliberate.** Every frame holds an intentional quiet zone — left third, upper-left, or centre — sized for oversized typography. It is composed, not left over.

---

## 2. Colour system

Sampled from the photography, then locked.

| Swatch | Name | Hex | Role |
|---|---|---|---|
| Deep Burgundy | `#7C1A21` | shadow base, footer, dark acts |
| Vermilion | `#C1121F` | primary brand red, links, active states |
| Scarlet | `#E0352B` | chilli accent, hero glow |
| Burnt Orange | `#B85C1E` | warm midtone, gradient bridge |
| Saffron | `#E9A11B` | gold highlight, CTA fill |
| Warm Ivory | `#F5EBDC` | type on dark, paper surfaces |
| Coriander Green | `#5E6B3F` | earthy secondary, coriander chapter |
| Antique Gold | `#C8A24A` | hairlines, foil rules — restrained only |
| Ink | `#1C1013` | body copy, deepest shadow |

**Discipline:** gold never fills an area larger than a hairline or a foil band. Saffron is the only colour permitted to glow. No blues, no pure black (`#000`), no pure white (`#fff`).

**Grade:** filmic S-curve, lifted-and-cooled shadows (never crushed to black — always a burgundy cast), warm highlights rolled off before clipping. Saturation sits at roughly 85–90% of what the raw photograph wants. That restraint is the whole difference between campaign work and stock.

---

## 3. Typography

| Layer | Role | Spec |
|---|---|---|
| Display | Product names, section headlines | High-contrast transitional serif, all caps, `-0.02em` tracking, optical sizes large |
| Brand mark | `SUCHI SPICES` | Same serif, small, wide letter-spacing (`0.35em`), always above a hairline gold rule |
| Body | Descriptions, editorial copy | Neutral grotesque, 15–19px, `1.6` leading, ivory at 62–74% opacity |
| Micro | Labels, eyebrows, chips | Grotesque, uppercase, `0.28–0.42em` tracking, 9.5–11px |

The pouch design system mirrors this exactly: brand mark + gold rule at the top, product name in two or three serif lines at centre, small supporting copy beneath, and a metallic-gold ornamental band low on the pouch. Proportions, rule weights and foil placement are identical across all four SKUs — only the field colour and the ornamental motif change.

---

## 4. Packaging system

Four tall matte stand-up pouches, identical dimensions and die-line:

| SKU | Field colour | Ornament |
|---|---|---|
| Red Chilli Powder | Scarlet `#E0352B` | geometric gold lattice band |
| Turmeric Powder | Saffron / ochre | warm gold foil band |
| Garam Masala | Burgundy / plum | floral gold cartouche |
| Coriander Powder | Warm ivory + green band | botanical gold line art |

Material: matte BOPP laminate with a fine tactile grain, soft gusset folds, a small crimp seal at the top, and one honest specular highlight down the left edge. No certifications, no award roundels, no health claims, no origin flags.

---

## 5. Motion language (for the build)

- **Hero (Asset 01):** 8–10s loop. Slow right-to-left drift with a shallow push-in; powder travels 1.5× faster than whole spices for parallax. Grade locked to the keyframe.
- **Scroll acts:** the site moves from dark (09) → warm (08) → scarlet (07) → ivory/earth (11) → dark finale (15). Treat the order as an emotional arc, not a gallery.
- **Transitions:** abstract plate (13) is the wipe/blend layer — use `mix-blend-mode: screen` or `soft-light` between chapters.
- **Parallax:** landscape assets translate at 0.85×, foreground spice elements at 1.15×. Never more than 40px of displacement or the realism breaks.
- **Type:** reveals clip upward from a mask, 700–900ms, `cubic-bezier(.2,.7,.2,1)`. No bounce, no spring — the brand is confident, not playful.

---

## 6. Asset manifest

| # | Asset | Ratio | File | Website use |
|---|---|---|---|---|
| 01 | Cinematic Hero keyframe | 16:9 | `assets/01-hero-cinematic.jpg` | Full-bleed hero / video reference plate |
| 02 | Hero Alternative | 16:9 | `assets/02-hero-alternative.jpg` | Chapter opener, parallax hero |
| 03 | Red Chilli Powder | 4:5 | `assets/03-red-chilli-powder.jpg` | Product showcase, PDP lead |
| 04 | Turmeric Powder | 4:5 | `assets/04-turmeric-powder.jpg` | Product showcase |
| 05 | Garam Masala | 4:5 | `assets/05-garam-masala.jpg` | Product showcase, blend hero |
| 06 | Coriander Powder | 4:5 | `assets/06-coriander-powder.jpg` | Product showcase |
| 07 | The Great Spice Explosion | 16:9 | `assets/07-spice-explosion.jpg` | Section divider, motion plate |
| 08 | Golden Spice World | 16:9 | `assets/08-golden-spice-world.jpg` | Story panel — warm act |
| 09 | Aromatic Dark Spices | 16:9 | `assets/09-aromatic-dark-spices.jpg` | Story panel — dark act |
| 10 | Authentic Indian Cooking | 16:9 | `assets/10-indian-cooking.jpg` | Heritage section, editorial |
| 11 | Ingredients and Heritage | 16:9 | `assets/11-ingredients-heritage.jpg` | Heritage section, craft |
| 12 | Signature Brand Still Life | 16:9 | `assets/12-brand-still-life.jpg` | Range hero, campaign anchor |
| 13 | Abstract Spice Background | 16:9 | `assets/13-abstract-spice-background.jpg` | Background plate, transition |
| 14 | Wide Ingredient Panorama | 21:9 | `assets/14-ingredient-panorama.jpg` | Pinned horizontal scroll |
| 15 | Closing Campaign Image | 16:9 | `assets/15-closing-campaign.jpg` | Final CTA section |

---

## 7. Spice coverage across the campaign

Red chillies (dried + powder) · turmeric (root, powder) · coriander (seed, powder, leaf) · cumin · black pepper · green cardamom · brown cardamom · cinnamon · cloves · star anise · mustard seed · fennel · curry leaf · saffron threads · fresh green chilli · ginger.

No single spice carries the brand. Chilli is the loudest voice, never the only one.

---

## 8. What is deliberately absent

Website UI or browser frames · collages, mood boards or contact sheets · text or watermarks inside photography · certifications, awards, health or purity claims · lens flares, glow bloom, HDR halos · cartoon or cheap-CGI rendering · oversaturated artificial colour · clutter that would fight an overlaid headline.
