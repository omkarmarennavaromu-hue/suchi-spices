"""Visual + behaviour audit of the Suchi Spices build.

Run against the dev server: python3 scripts/audit.py
Writes screenshots to ../shots/ and prints console errors, overflow checks and
per-image load results.
"""
import os, sys, json, time
from playwright.sync_api import sync_playwright

URL = os.environ.get('AUDIT_URL', 'http://localhost:5173/')
OUT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) + '/../shots'
os.makedirs(OUT, exist_ok=True)

console, errors = [], []


def prep(page):
    page.on('console', lambda m: console.append((m.type, m.text[:300])))
    page.on('pageerror', lambda e: errors.append(str(e)[:400]))


def report(page, label):
    stats = page.evaluate("""() => {
      const doc = document.documentElement;
      const imgs = [...document.images].map(i => ({
        src: i.currentSrc.split('/').pop(), ok: i.naturalWidth > 0,
        w: i.naturalWidth, loading: i.loading
      }));
      const v = document.querySelector('video');
      return {
        scrollW: doc.scrollWidth, clientW: doc.clientWidth,
        overflowsX: doc.scrollWidth > doc.clientWidth + 1,
        bodyH: document.body.scrollHeight,
        imgsBad: imgs.filter(i => !i.ok).map(i => i.src),
        imgCount: imgs.length,
        video: v ? { rs: v.readyState, paused: v.paused, w: v.videoWidth, h: v.videoHeight, err: v.error && v.error.code } : null,
        h1: document.querySelector('h1')?.innerText,
        fonts: document.fonts.status,
      };
    }""")
    print(f'\n=== {label} ===')
    print(json.dumps(stats, indent=1))


def shoot(page, name, full=False):
    page.screenshot(path=f'{OUT}/{name}.png', full_page=full)
    print('shot', name)


def scroll_to(page, y, wait=1.4):
    page.evaluate(f'window.scrollTo(0, {y})')
    page.wait_for_timeout(int(wait * 1000))


def section_top(page, sel):
    return page.evaluate(
        f"document.querySelector('{sel}').getBoundingClientRect().top + window.scrollY"
    )


with sync_playwright() as p:
    browser = p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required'])

    # ---------------- desktop ----------------
    page = browser.new_page(viewport={'width': 1440, 'height': 900}, device_scale_factor=1)
    prep(page)
    page.goto(URL, wait_until='networkidle')
    page.wait_for_timeout(2600)
    shoot(page, 'd01-hero')
    report(page, 'desktop 1440 hero')

    for name, sel, extra in [
        ('d02-manifesto', '#manifesto', 200),
        ('d03-journey-a', '#journey', 40),
        ('d04-collection', '#collection', 320),
        ('d05-motion', '#motion', 60),
        ('d06-cooking', '#cooking', 120),
        ('d07-craft', '#craft', 500),
        ('d08-campaign', '#campaign', 0),
        ('d09-cta', '#close', 150),
        ('d10-footer', 'footer', 0),
    ]:
        y = section_top(page, sel)
        scroll_to(page, y + extra)
        shoot(page, name)

    # pinned journey: three sample positions inside the pin
    j_top = section_top(page, '#journey')
    for i, offset in enumerate([900, 1900, 2700]):
        scroll_to(page, j_top + offset, 1.2)
        shoot(page, f'd03b-journey-{i + 1}')

    # ---------------- interactions ----------------
    scroll_to(page, section_top(page, '#collection') + 320)
    page.wait_for_timeout(600)
    page.locator('[data-product-card] button').first.click()
    page.wait_for_timeout(1100)
    shoot(page, 'd11-modal')
    modal_open = page.evaluate("() => !!document.querySelector('[role=dialog]')")
    focus_in = page.evaluate("() => document.activeElement?.getAttribute('aria-label') || document.activeElement?.tagName")
    page.keyboard.press('Escape')
    page.wait_for_timeout(700)
    modal_closed = page.evaluate("() => !document.querySelector('[role=dialog]')")
    print('\nmodal:', {'opened': modal_open, 'focus': focus_in, 'closedOnEsc': modal_closed})

    # ---------------- mobile ----------------
    m = browser.new_page(
        viewport={'width': 390, 'height': 844}, device_scale_factor=2,
        is_mobile=True, has_touch=True,
        user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    )
    prep(m)
    m.goto(URL, wait_until='networkidle')
    m.wait_for_timeout(2400)
    shoot(m, 'm01-hero')
    report(m, 'mobile 390 hero')

    for name, sel, extra in [
        ('m02-manifesto', '#manifesto', 160),
        ('m03-journey', '#journey', 420),
        ('m04-collection', '#collection', 520),
        ('m05-motion', '#motion', 300),
        ('m06-cooking', '#cooking', 320),
        ('m07-craft', '#craft', 700),
        ('m08-campaign', '#campaign', 0),
        ('m09-cta', '#close', 120),
        ('m10-footer', 'footer', 0),
    ]:
        m.evaluate(f"window.scrollTo(0, document.querySelector('{sel}').getBoundingClientRect().top + window.scrollY + {extra})")
        m.wait_for_timeout(1300)
        shoot(m, name)

    # mobile menu
    m.evaluate('window.scrollTo(0,0)')
    m.wait_for_timeout(500)
    m.locator('button[aria-controls="mobile-menu"]').click()
    m.wait_for_timeout(900)
    shoot(m, 'm11-menu')
    menu_visible = m.evaluate("() => document.querySelector('#mobile-menu')?.getAttribute('aria-hidden') === 'false'")
    print('mobile menu open:', menu_visible)

    # ---------------- tablet ----------------
    t = browser.new_page(viewport={'width': 768, 'height': 1024})
    prep(t)
    t.goto(URL, wait_until='networkidle')
    t.wait_for_timeout(2000)
    shoot(t, 't01-hero')
    report(t, 'tablet 768 hero')

    # ---------------- reduced motion ----------------
    r = browser.new_page(viewport={'width': 1440, 'height': 900}, reduced_motion='reduce')
    prep(r)
    r.goto(URL, wait_until='networkidle')
    r.wait_for_timeout(1800)
    shoot(r, 'r01-hero-reduced')
    rm = r.evaluate("""() => ({
      video: !!document.querySelector('video'),
      h1opacity: getComputedStyle(document.querySelector('h1')).opacity,
      h1visible: document.querySelector('h1').getBoundingClientRect().height > 0,
      imgFallback: [...document.querySelectorAll('img')].slice(0,3).map(i => i.currentSrc.split('/').pop())
    })""")
    print('\nreduced motion:', rm)
    r.evaluate("window.scrollTo(0, document.querySelector('#journey').getBoundingClientRect().top + window.scrollY + 300)")
    r.wait_for_timeout(1200)
    shoot(r, 'r02-journey-reduced')

    browser.close()

print('\n=== console (warn/error) ===')
for t_, txt in console:
    if t_ in ('error', 'warning'):
        print(t_, txt)
print('\n=== page errors ===')
for e in errors:
    print(e)
