import base64, os, json, html

ASSETS = [
 (1,"Cinematic Hero — Video Keyframe","01-hero-cinematic",16/9,"Landscape · 16:9",
  "Cinematic hero keyframe for the 10-second background film. Volumetric scarlet, saffron and burgundy light through a floating spice cloud. Left-centre held open for oversized typography.",
  ["Turmeric powder cloud","Coriander · cumin","Green cardamom","Cinnamon quill","Star anise","Dried red chillies","Mustard seed"],
  "Full-bleed hero · video reference plate"),
 (2,"Hero Alternative Background","02-hero-alternative",16/9,"Landscape · 16:9",
  "Suspended static hero variant. Ivory-to-burgundy vertical gradient with saffron haze; ingredients hold clean silhouettes so type can sit over the quiet left column.",
  ["Dried red chillies","Turmeric root","Cinnamon quills","Star anise","Green cardamom","Cloves","Black pepper","Coriander · cumin","Saffron threads"],
  "Chapter opener · parallax hero"),
 (3,"Red Chilli Powder — Product","03-red-chilli-powder",4/5,"Portrait · 4:5",
  "Scarlet monochrome studio. Matte stand-up pouch with gold-foil ornamental band, sculptural dried chillies and a clean powder drift.",
  ["Dried red chillies","Chilli powder"],
  "Product showcase · PDP lead"),
 (4,"Turmeric Powder — Product","04-turmeric-powder",4/5,"Portrait · 4:5",
  "Saffron and ochre monochrome studio. Same pouch proportions and typographic hierarchy, tuned to a golden key.",
  ["Turmeric root","Turmeric powder"],
  "Product showcase"),
 (5,"Garam Masala — Product","05-garam-masala",4/5,"Portrait · 4:5",
  "Deep burgundy low-key set. Aromatic whole-spice vignette built from cinnamon, cardamom, clove, pepper and star anise.",
  ["Cinnamon quill","Green cardamom","Brown cardamom","Cloves","Black pepper","Star anise"],
  "Product showcase · blend hero"),
 (6,"Coriander Powder — Product","06-coriander-powder",4/5,"Portrait · 4:5",
  "Warm ivory and earthy green high-key set. Botanical line illustration, fresh leaf sprig and a soft powder mound.",
  ["Coriander seed","Fresh coriander leaf","Coriander powder"],
  "Product showcase"),
 (7,"The Great Spice Explosion","07-spice-explosion",16/9,"Landscape · 16:9",
  "High-speed macro capture. Foreground seed plane, mid-ground powder cloud, distant bokeh — three distinct depth layers with a dark pocket left for copy.",
  ["Red chillies","Turmeric powder","Coriander · cumin","Green cardamom","Cinnamon","Star anise","Black pepper"],
  "Section divider · motion plate"),
 (8,"Golden Spice World","08-golden-spice-world",16/9,"Landscape · 16:9",
  "Sculptural turmeric cloud against burnt-orange falloff. The warmest frame in the collection; anchors the golden midpoint of the scroll.",
  ["Turmeric powder","Turmeric root","Coriander seed","Cumin","Green cardamom","Cinnamon","Saffron"],
  "Story panel · warm act"),
 (9,"Aromatic Dark Spices","09-aromatic-dark-spices",16/9,"Landscape · 16:9",
  "Raking single-source light across bark, pod and pepper on a burgundy stone. The darkest, most restrained frame — long layered shadows.",
  ["Cinnamon quills","Green cardamom","Brown cardamom","Cloves","Star anise","Black pepper","Cumin"],
  "Story panel · dark act"),
 (10,"Authentic Indian Cooking","10-indian-cooking",16/9,"Landscape · 16:9",
  "A tarka caught mid-sizzle in cast iron. Real steam, ghee highlights, lived-in mise en place — the human proof point in the campaign.",
  ["Cumin","Mustard seed","Curry leaf","Dried red chillies","Turmeric","Garam masala","Ginger","Green chilli"],
  "Heritage section · editorial"),
 (11,"Ingredients and Heritage","11-ingredients-heritage",16/9,"Landscape · 16:9",
  "Terracotta and ivory surfaces under low side sun. Raw roots, fresh and dried chillies, brass and clay — material honesty over styling.",
  ["Turmeric root","Coriander · cumin","Green chilli","Red chilli","Cardamom","Cinnamon","Star anise","Black pepper"],
  "Heritage section · craft"),
 (12,"Signature Brand Still Life","12-brand-still-life",16/9,"Landscape · 16:9",
  "The full four-pouch range on a polished plinth. Uniform proportions, one design system, four colourways.",
  ["Full product range","Chillies","Turmeric","Cinnamon","Cardamom","Star anise","Peppercorns","Seeds"],
  "Range hero · campaign anchor"),
 (13,"Abstract Spice Background","13-abstract-spice-background",16/9,"Landscape · 16:9",
  "Powder as pure form. Sculptural ribbons and veils with no recognisable objects — a texture plate for scroll-driven reveals and blend modes.",
  ["Powder only — abstract"],
  "Background plate · transition"),
 (14,"Wide Ingredient Panorama","14-ingredient-panorama",21/9,"Landscape · 21:9",
  "A colour spectrum read left to right: scarlet, gold, earth, green, dark. Horizontal rhythm designed for a pinned scroll-strip.",
  ["Red chillies","Turmeric","Coriander · cumin · fennel · mustard","Cardamom · curry leaf","Cinnamon · clove · star anise · pepper"],
  "Pinned horizontal scroll"),
 (15,"Closing Campaign Image","15-closing-campaign",16/9,"Landscape · 16:9",
  "Ingredients form a vignette around an open saffron-lit centre. Negative space is the call to action.",
  ["Red chillies","Turmeric","Cinnamon","Star anise","Cardamom","Cloves","Black pepper","Seeds"],
  "Final CTA section"),
]

PALETTE = [
 ("#7C1A21","Deep Burgundy","Shadow base, footer, dark acts"),
 ("#C1121F","Vermilion","Primary brand red, links, active states"),
 ("#E0352B","Scarlet","Chilli accent, hero glow"),
 ("#B85C1E","Burnt Orange","Warm midtone, gradient bridge"),
 ("#E9A11B","Saffron","Gold highlight, CTA fill"),
 ("#F5EBDC","Warm Ivory","Type on dark, paper surfaces"),
 ("#5E6B3F","Coriander Green","Earthy secondary, coriander chapter"),
 ("#C8A24A","Antique Gold","Hairlines, foil rules — restrained only"),
 ("#1C1013","Ink","Body copy, deepest shadow"),
]

def b64(p):
    return "data:image/jpeg;base64," + base64.b64encode(open(p,'rb').read()).decode()

cards=[]
for n,title,slug,ar,orient,desc,spices,usage in ASSETS:
    prev=f"preview/{slug}_prev.jpg"
    full=f"assets/{slug}.jpg"
    if os.path.exists(prev):
        img=f'<img src="{b64(prev)}" alt="{html.escape(title)}" loading="lazy">'
        state="ready"
    else:
        img='<div class="pending"><span>QUEUED</span><em>Next render pass</em></div>'
        state="pending"
    chip = "".join(f"<li>{html.escape(s)}</li>" for s in spices)
    cards.append(f'''
  <article class="card {state}" id="asset-{n:02d}">
    <header>
      <span class="num">{n:02d}</span>
      <span class="orient">{orient}</span>
    </header>
    <figure class="frame ar-{'wide' if ar>1.6 else ('pano' if ar>2 else 'port')}">{img}</figure>
    <div class="meta">
      <h2>{html.escape(title)}</h2>
      <p>{html.escape(desc)}</p>
      <ul class="spices">{chip}</ul>
      <p class="usage"><b>Website use</b> {html.escape(usage)}</p>
      <p class="file">/assets/{slug}.jpg</p>
    </div>
  </article>''')

swatches="".join(f'<div class="sw"><span style="background:{h}"></span><b>{html.escape(n)}</b><code>{h}</code><em>{html.escape(u)}</em></div>' for h,n,u in PALETTE)

CSS = """
:root{--ink:#140b0d;--burg:#5c1218;--scar:#e0352b;--saff:#e9a11b;--ivory:#f5ebdc;--gold:#c8a24a}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:var(--ink);color:var(--ivory);font-family:"Helvetica Neue",Inter,Arial,sans-serif;-webkit-font-smoothing:antialiased}
.serif{font-family:"Iowan Old Style","Palatino Linotype","Times New Roman",serif}
.wrap{max-width:1400px;margin:0 auto;padding:0 clamp(20px,4vw,64px)}
.hero{padding:clamp(56px,9vw,120px) 0 clamp(40px,6vw,80px);border-bottom:1px solid rgba(245,235,220,.13)}
.eyebrow{font-size:11px;letter-spacing:.42em;text-transform:uppercase;color:var(--gold);margin:0 0 26px}
h1{font-family:"Iowan Old Style","Palatino Linotype",serif;font-weight:400;font-size:clamp(46px,11vw,148px);line-height:.86;letter-spacing:-.03em;margin:0}
h1 em{font-style:italic;color:var(--saff)}
.lede{max-width:660px;margin:34px 0 0;font-size:clamp(15px,1.5vw,19px);line-height:1.65;color:rgba(245,235,220,.74)}
.stats{display:flex;flex-wrap:wrap;gap:clamp(24px,5vw,72px);margin-top:48px}
.stats div b{display:block;font-family:"Iowan Old Style",serif;font-size:clamp(26px,3vw,40px);color:var(--saff);font-weight:400}
.stats div span{font-size:10.5px;letter-spacing:.3em;text-transform:uppercase;color:rgba(245,235,220,.5)}
section{padding:clamp(48px,7vw,96px) 0}
h2.sec{font-family:"Iowan Old Style",serif;font-weight:400;font-size:clamp(24px,3.4vw,42px);margin:0 0 8px}
p.secsub{color:rgba(245,235,220,.55);font-size:14px;letter-spacing:.06em;margin:0 0 40px}
.sws{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:18px}
.sw span{display:block;height:92px;border-radius:2px;margin-bottom:12px}
.sw b{display:block;font-size:12.5px;letter-spacing:.08em}
.sw code{display:block;font-size:11px;color:var(--gold);margin:3px 0 4px}
.sw em{font-style:normal;font-size:10.5px;color:rgba(245,235,220,.45);line-height:1.5;display:block}
.grid{display:grid;grid-template-columns:repeat(12,1fr);gap:clamp(18px,2.4vw,34px)}
.card{grid-column:span 6;background:rgba(255,255,255,.022);border:1px solid rgba(245,235,220,.09);padding:0 0 2px;display:flex;flex-direction:column}
.card.wide{grid-column:span 12}
.card header{display:flex;justify-content:space-between;align-items:center;padding:16px 20px;border-bottom:1px solid rgba(245,235,220,.08)}
.num{font-family:"Iowan Old Style",serif;font-size:20px;color:var(--saff)}
.orient{font-size:9.5px;letter-spacing:.28em;text-transform:uppercase;color:rgba(245,235,220,.45)}
.frame{margin:0;overflow:hidden;background:#0a0507}
.frame.ar-wide{aspect-ratio:16/9}.frame.ar-pano{aspect-ratio:21/9}.frame.ar-port{aspect-ratio:4/5;max-height:760px}
.frame img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .9s cubic-bezier(.2,.7,.2,1)}
.card:hover .frame img{transform:scale(1.028)}
.pending{width:100%;height:100%;min-height:280px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;background:repeating-linear-gradient(45deg,#150c0f,#150c0f 14px,#1a0f13 14px,#1a0f13 28px)}
.pending span{font-size:10px;letter-spacing:.34em;color:var(--saff)}
.pending em{font-style:normal;font-size:11px;color:rgba(245,235,220,.35)}
.meta{padding:22px 20px 26px}
.meta h2{font-family:"Iowan Old Style",serif;font-weight:400;font-size:clamp(19px,2vw,26px);margin:0 0 10px;letter-spacing:-.01em}
.meta p{font-size:13.5px;line-height:1.6;color:rgba(245,235,220,.62);margin:0 0 14px}
ul.spices{list-style:none;display:flex;flex-wrap:wrap;gap:6px;padding:0;margin:0 0 16px}
ul.spices li{font-size:9.5px;letter-spacing:.14em;text-transform:uppercase;color:rgba(245,235,220,.6);border:1px solid rgba(245,235,220,.16);padding:4px 9px;border-radius:999px}
.usage{font-size:11.5px!important;color:rgba(245,235,220,.42)!important;margin-bottom:6px!important}
.usage b{color:var(--gold);font-weight:400;letter-spacing:.18em;text-transform:uppercase;font-size:9.5px;margin-right:8px}
.file{font-family:ui-monospace,Menlo,monospace;font-size:10.5px!important;color:rgba(200,162,74,.6)!important;margin:0!important}
footer{border-top:1px solid rgba(245,235,220,.13);padding:44px 0 72px;color:rgba(245,235,220,.4);font-size:11.5px;letter-spacing:.12em}
@media(max-width:860px){.card{grid-column:span 12}}
"""

body=f"""<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>SUCHI SPICES — A Universe of Flavour · Asset Collection</title>
<style>{CSS}</style></head><body>
<div class="wrap">
<div class="hero">
  <p class="eyebrow">Suchi Spices · Asset Collection · Vol. 01</p>
  <h1>A<br>Universe<br><em>of Flavour</em></h1>
  <p class="lede">A coordinated visual system for an immersive, scroll-driven brand site. Fifteen standalone assets — cinematic hero plates, a four-SKU packaging range, macro spice photography and abstract texture fields — built on one lighting logic, one colour grade and one typographic hierarchy.</p>
  <div class="stats">
    <div><b>15</b><span>Assets</span></div>
    <div><b>4</b><span>Product SKUs</span></div>
    <div><b>21:9</b><span>Max aspect</span></div>
    <div><b>01</b><span>Grade</span></div>
  </div>
</div>

<section>
  <h2 class="sec">Colour System</h2>
  <p class="secsub">Sampled from the campaign photography. Every asset grades into this palette and nothing outside it.</p>
  <div class="sws">{swatches}</div>
</section>

<section id="collection">
  <h2 class="sec">The Collection</h2>
  <p class="secsub">Each file is an independent, full-resolution image — no composites, no contact sheets.</p>
  <div class="grid">{"".join(cards)}</div>
</section>
</div>
<footer><div class="wrap">Suchi Spices — fictional brand · campaign assets for website production · no certifications, awards or health claims depicted</div></footer>
</body></html>"""

open('index.html','w').write(body)
print("index.html", round(len(body)/1024), "KB")
