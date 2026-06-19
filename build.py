#!/usr/bin/env python3
"""Static site generator for Fluid Glass — assembles every page from one shared
shell (capsule header + menu overlay + intro + cursor + cookie + footer) so the
navigation/chrome is identical site-wide. Zero runtime build; outputs plain HTML."""
import os

BASE = "/Tgclint/"          # GitHub Pages project path; change to "/" for a root domain
ROOT = os.path.dirname(os.path.abspath(__file__))

DIAMOND = ('<svg viewBox="0 0 42 42" fill="none" aria-hidden="true">'
           '<path d="M42 15.1935V10.5L21 0L0 10.5V31.5L21 42L42 31.5V19.95L25.2 11.55V23.2995L37.2435 29.1795L21 37.3065L4.2 28.9065V13.0935L21 4.6935L42 15.1935Z" fill="currentColor"/>'
           '<path d="M21 13.902V9.45L8.4 15.75V20.4435L21 13.902Z" fill="currentColor"/></svg>')
ARROW = ('<svg class="arrow-svg" viewBox="0 0 14 11" fill="none" aria-hidden="true">'
         '<path d="M8.5 1 13 5.5 8.5 10M13 5.5H1" stroke="currentColor" stroke-width="1.4"/></svg>')
BURGER = '<svg viewBox="0 0 20 11" fill="none" aria-hidden="true"><path d="M0 1h20M0 10h20" stroke="currentColor" stroke-width="1.4"/></svg>'
CLOSE = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" stroke="currentColor" stroke-width="1.6"/></svg>'

MAIN_NAV = [("About", "about/"), ("Collection", "collection/"),
            ("Projects", "projects/"), ("Approach", "approach/"), ("Contact", "contact/")]
SUB_NAV = [("News", "news/"), ("Showroom", "showroom/"),
           ("020 8156 7290", "tel:02081567290"), ("hello@fluid.glass", "mailto:hello@fluid.glass")]


def head(title, desc):
    return f"""<!doctype html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <base href="{BASE}" />
  <meta name="description" content="{desc}" />
  <meta name="author" content="Fluid Glass" />
  <meta name="robots" content="index, follow" />
  <meta property="og:site_name" content="Fluid Glass" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="{title}" />
  <meta property="og:description" content="{desc}" />
  <meta property="og:image" content="assets/images/hero-bg.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content="assets/images/hero-bg.jpg" />
  <link rel="canonical" href="https://fluid.glass/" />
  <link rel="preconnect" href="https://api.fontshare.com" crossorigin />
  <link href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&f[]=jetbrains-mono@500,600&display=swap" rel="stylesheet" />
  <title>{title}</title>
  <style>
    @font-face {{ font-family:'Aeonik Pro'; src:local('Satoshi-Regular'),local('Satoshi'); font-weight:400; font-display:swap; }}
    @font-face {{ font-family:'Aeonik Pro'; src:local('Satoshi-Medium'),local('Satoshi'); font-weight:500; font-display:swap; }}
    @font-face {{ font-family:'Aeonik Pro'; src:local('Satoshi-Bold'),local('Satoshi'); font-weight:700; font-display:swap; }}
    @font-face {{ font-family:'Aeonik Mono'; src:local('JetBrains Mono'); font-weight:500; font-display:swap; }}
    @font-face {{ font-family:'Aeonik Mono'; src:local('JetBrains Mono'); font-weight:600; font-display:swap; }}
  </style>
  <link rel="stylesheet" href="assets/css/design-system.css" />
  <link rel="stylesheet" href="assets/css/site.css" />
</head>
<body>"""


def intro():
    return f"""
  <div class="intro" role="presentation">
    <div class="logo">
      <div class="brandmark">
        {DIAMOND}
        <div class="cube"><div class="shape">
          <div class="face face-front"></div><div class="face face-back"></div>
          <div class="face face-right"></div><div class="face face-left"></div>
          <div class="face face-top"></div><div class="face face-bottom"></div>
        </div></div>
      </div>
      <div class="wordmark"><span style="font-family:var(--font-f-aeonik-mono);font-weight:600;font-size:2rem;letter-spacing:.12em;text-transform:uppercase">Fluid&nbsp;Glass</span></div>
    </div>
  </div>"""


def cursor():
    return '\n  <div class="cursor" aria-hidden="true"><div class="label">View</div></div>'


def cookies():
    return f"""
  <div class="cookies" role="dialog" aria-label="Cookies">
    <span class="base-title">Cookies</span>
    <p class="text">We use cookies to enhance navigation, analyse usage and support our work. See our privacy policy for details.</p>
    <div class="buttons">
      <button class="base-button is-black" type="button" data-cookie="accept">Accept {ARROW}</button>
      <button class="base-button is-alpha" type="button" data-cookie="deny">Deny</button>
    </div>
  </div>"""


def header(title_text):
    return f"""
  <header class="header" aria-label="Primary">
    <a class="logo" href="{BASE}" aria-label="Fluid Glass — home">{DIAMOND}</a>
    <div class="title" aria-hidden="true"><div class="title-inner" data-base="{title_text}">{title_text}</div></div>
    <button class="burger" type="button" aria-label="Open menu" aria-expanded="false">{BURGER}</button>
    <button class="close" type="button" aria-label="Close menu">{CLOSE}</button>
    <div class="background"></div>
  </header>"""


def menu(active):
    main_items = ""
    for label, href in MAIN_NAV:
        cls = " is-active" if href == active else ""
        main_items += (f'<li class="item{cls}"><div class="mask">'
                       f'<a class="link" href="{href}">{label}</a></div></li>')
    sub_items = ""
    for label, href in SUB_NAV:
        ext = ' target="_blank" rel="noopener noreferrer"' if href.startswith(("tel:", "mailto:")) else ""
        sub_items += f'<li class="mask"><a class="link" href="{href}"{ext}>{label}</a></li>'
    return f"""
  <div class="menu" aria-label="Menu">
    <nav class="nav">
      <div class="menu-title">Menu</div>
      <ul class="main">{main_items}</ul>
      <ul class="sub">{sub_items}</ul>
      <a class="base-button is-black" href="contact/">Get a quote {ARROW}</a>
    </nav>
    <div class="background"></div>
  </div>"""


def footer():
    cols = {
        "Studio": [("About", "about/"), ("Approach", "approach/"), ("News", "news/")],
        "Work": [("Collection", "collection/"), ("Projects", "projects/"), ("Showroom", "showroom/")],
        "Connect": [("hello@fluid.glass", "mailto:hello@fluid.glass"),
                    ("020 8156 7290", "tel:02081567290"),
                    ("Instagram", "https://instagram.com/fluidglassuk"),
                    ("LinkedIn", "https://linkedin.com/company/fluidglassuk")],
    }
    col_html = ""
    for title, links in cols.items():
        lis = ""
        for label, href in links:
            ext = ' target="_blank" rel="noopener noreferrer"' if href.startswith(("http", "tel:", "mailto:")) else ""
            lis += f'<li><a class="link-underline" href="{href}"{ext}>{label}</a></li>'
        col_html += f'<div><h4>{title}</h4><ul class="col">{lis}</ul></div>'
    return f"""
  <footer class="footer">
    <div class="bg"><img class="lazy-image" src="assets/images/footer-bg.jpg" alt="" /></div>
    <div class="inner">
      <div class="top">
        <div>
          <span class="brand"><span class="mark"></span>Fluid&nbsp;Glass</span>
          <p class="lede">Structural &amp; architectural glazing specialists. Engineering daylight and view into the buildings of tomorrow.</p>
        </div>
        {col_html}
      </div>
      <div class="bottom">
        <span>© <span data-year>2026</span>, Fluid Glass</span>
        <span>Crafted in the United Kingdom</span>
      </div>
    </div>
  </footer>"""


def scripts():
    return """
  <script src="https://unpkg.com/lenis@1.1.13/dist/lenis.min.js"></script>
  <script src="assets/js/main.js"></script>
</body>
</html>"""


def modal():
    return f"""
  <div class="modal" id="product-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" hidden>
    <div class="modal-backdrop" data-modal-close></div>
    <div class="modal-panel">
      <button class="modal-close" type="button" aria-label="Close" data-modal-close>{CLOSE}</button>
      <div class="modal-media"><img id="modal-img" src="" alt="" /></div>
      <div class="modal-body">
        <span class="idx" id="modal-index"></span>
        <h3 id="modal-title"></h3>
        <p id="modal-desc"></p>
        <ul class="modal-specs" id="modal-specs"></ul>
        <a class="base-button is-black" href="contact/" data-modal-close>Start a project {ARROW}</a>
      </div>
    </div>
  </div>"""


def page(title, desc, body, title_text, active, with_modal=False, page_header=None):
    ph = page_header if page_header is not None else ""
    return (head(title, desc) + intro() + cursor() + cookies() + ph + header(title_text) +
            menu(active) + body + (modal() if with_modal else "") + footer() + scripts())


def write(path, html):
    full = os.path.join(ROOT, path)
    os.makedirs(os.path.dirname(full), exist_ok=True) if os.path.dirname(full) else None
    with open(full, "w") as f:
        f.write(html)
    print("wrote", path)


# ---- product data (shared home + collection) -----------------------------
PRODUCTS = [
    dict(i="01 — Structural", t="Structural glazing", img="product-structural", tall=True,
         d="Self-supporting walls of glass with minimal or no visible framing. We engineer structural glass fins and slimline silicone joints so the glass itself carries the load — turning a whole elevation into uninterrupted view.",
         specs="Frameless & minimal sightlines|Spans up to 12m in a single plane|Structural glass fins, no steel|Low-iron, solar-controlled glass"),
    dict(i="02 — Doors", t="Pivot &amp; sliding doors", img="product-doors", tall=True,
         d="Oversized pivots that swing on a hidden spindle and slimline sliders that glide on concealed tracks. Each door is balanced to move with a fingertip and sealed tight against wind and rain.",
         specs="Pivot leaves up to 3.5m tall|Concealed floor & ceiling pivots|Thermally broken, weather-sealed|Flush thresholds, level access"),
    dict(i="03 — Windows", t="Steel-look windows", img="product-windows", tall=False,
         d="The crisp, slender sightlines of heritage steel in a modern, thermally-broken aluminium system. Fine bars and deep reveals frame the view like a picture, without the maintenance of true steel.",
         specs="20mm ultra-slim sightlines|Heritage bar & astragal options|Thermally broken for warmth|Matt or textured finishes"),
    dict(i="04 — Additional", t="Rooflights &amp; specials", img="product-additional", tall=False,
         d="Structural rooflights, frameless balustrades and one-off pieces engineered around your drawings. When a project needs something that doesn't exist yet, we detail, test and make it.",
         specs="Walk-on & structural rooflights|Frameless glass balustrades|Curved & bespoke fabrication|Bonded, fixing-free details"),
]


def product_cards():
    out = ""
    for p in PRODUCTS:
        tall = " tall" if p["tall"] else ""
        out += f"""
          <article class="product-card{tall}">
            <a class="card-link" href="contact/" aria-label="Open {p['t']} details" data-modal
               data-index="{p['i']}" data-title="{p['t']}" data-img="assets/images/{p['img']}.jpg"
               data-desc="{p['d']}" data-specs="{p['specs']}"></a>
            <div class="media"><img class="lazy-image" src="assets/images/{p['img']}.jpg" alt="{p['t']}" /></div>
            <div class="product-body">
              <span class="idx">{p['i']}</span>
              <h3>{p['t']}</h3>
              <p>{p['d'][:120]}…</p>
              <span class="product-more">Discover <span class="arrow">→</span></span>
            </div>
          </article>"""
    return out


# ===================== HOME =====================
home_body = f"""
  <main>
    <section class="home-header" data-name="Home">
      <div class="background"><img class="lazy-image" src="assets/images/hero-bg.jpg" alt="Black-clad rural house with full-height structural glazing over a meadow" /></div>
      <div class="container">
        <div class="row">
          <p class="base-heading">Exceptional glazing for those who build with vision.</p>
          <div class="indicator" aria-hidden="true">Scroll to explore</div>
        </div>
        <div class="row">
          <h2 class="base-title">Glazing specialists</h2>
          <p class="text">We design and install bespoke glass systems for ambitious architectural projects. Every pane reflects our commitment to clarity, quality and collaboration.</p>
        </div>
      </div>
    </section>

    <section class="section container" data-name="About">
      <div class="text-cta reveal">
        <span class="base-title">About Fluid Glass</span>
        <p class="base-heading">We bring architecture to life through <em>craft and innovation</em> — trusted by architects who demand precision, beauty and care.</p>
        <div class="btn-row"><a class="base-button is-black" href="about/">Who we are {ARROW}</a></div>
      </div>
    </section>

    <section class="section container" id="collection" data-name="Collection">
      <div class="section-head reveal">
        <div><span class="base-title" style="margin-bottom:2rem">Collection</span><h2>Systems engineered<br/>for clarity.</h2></div>
        <p class="muted lead" style="max-width:40ch">Four core families, each detailed to vanish — letting structure, light and landscape do the talking.</p>
      </div>
      <div class="product-grid reveal">{product_cards()}</div>
      <div class="btn-row reveal" style="margin-top:4rem"><a class="base-button is-alpha" href="collection/">View the full collection</a></div>
    </section>

    <section class="banner is-left" data-name="Showroom">
      <div class="media"><img class="lazy-image" src="assets/images/showroom.jpg" alt="Dark architectural showroom of full-height glass partitions" /></div>
      <div class="inner reveal">
        <span class="eyebrow">Visit the showroom</span>
        <h2>See, touch and open every system before you commit.</h2>
        <p>Our showroom puts full-scale glazing in your hands — slide the doors, feel the sightlines and compare finishes under real daylight.</p>
        <div class="btn-row"><a class="base-button is-white" href="showroom/">Book a visit {ARROW}</a></div>
      </div>
    </section>

    <section class="section container" data-name="Projects">
      <div class="section-head reveal">
        <div><span class="base-title" style="margin-bottom:2rem">Featured projects</span><h2>Recent work.</h2></div>
        <p class="muted lead" style="max-width:40ch">A handful of homes and buildings where glass does the heavy lifting.</p>
      </div>
      <div class="projects-grid reveal">
        <a class="project" href="projects/"><div class="media"><img class="lazy-image" src="assets/images/duo-1.jpg" alt="Ashmead Barn"/></div><div class="meta"><h3>Ashmead Barn</h3><span class="loc">Cotswolds</span></div></a>
        <a class="project" href="projects/"><div class="media"><img class="lazy-image" src="assets/images/duo-2.jpg" alt="Keeper's Cottage"/></div><div class="meta"><h3>Keeper's Cottage</h3><span class="loc">Surrey</span></div></a>
      </div>
    </section>

    <section class="section container" data-name="Craft">
      <div class="assets-duo reveal">
        <div class="figure tall"><img class="lazy-image" src="assets/images/duo-1.jpg" alt="Double-height living room with a vast glazed gable"/></div>
        <div class="copy">
          <span class="base-title">The craft</span>
          <h2>Detailed by engineers, finished by hand.</h2>
          <p class="lead">From the first survey to the final silicone joint, a single team owns your project — modelling every connection and installing to millimetre tolerances.</p>
          <div class="btn-row"><a class="base-button is-alpha" href="approach/">Our approach</a></div>
        </div>
        <div class="figure"><img class="lazy-image" src="assets/images/duo-2.jpg" alt="Brick and timber house with large glazed openings"/></div>
      </div>
    </section>

    <section class="section container" data-name="Reviews">
      <div class="reviews reveal">
        <blockquote>“They made twelve metres of glass feel effortless.”</blockquote>
        <div class="cite"><img class="lazy-image" src="assets/images/client-avatar.jpg" alt="James Okonkwo"/><span class="who">James Okonkwo<span>Principal, Studio Meridian</span></span></div>
      </div>
    </section>

    <section class="banner is-center" id="contact" data-name="Contact">
      <div class="media"><img class="lazy-image" src="assets/images/footer-bg.jpg" alt="Sunlit room with floor-to-ceiling glazing onto a forest"/></div>
      <div class="inner reveal">
        <span class="eyebrow">Start a project</span>
        <h2>Let's design glass that disappears.</h2>
        <div class="btn-row"><a class="base-button is-white" href="contact/">Get a quote {ARROW}</a></div>
      </div>
    </section>
  </main>"""
HOME_PH = f'<section class="page-header"><a class="logo" href="{BASE}"><span class="mark"></span>Fluid Glass</a><h1>Fluid Glass</h1><a class="base-button is-alpha" href="contact/">Get a quote</a></section>'

write("index.html", page("Fluid Glass - Structural & Architectural Glazing Specialists",
      "Leading UK specialists in architectural and structural glazing, delivering cutting-edge glass solutions for iconic projects.",
      home_body, "Fluid Glass", "", with_modal=True, page_header=HOME_PH))


# ===================== generic sub-page hero =====================
def page_hero(eyebrow, title, sub):
    return f"""
  <main>
    <section class="page-hero">
      <span class="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p class="sub">{sub}</p>
    </section>"""


# ===================== ABOUT =====================
about_body = page_hero("About", "A studio built around glass.", "For two decades we have partnered with architects, developers and homeowners to deliver glazing that performs as beautifully as it looks.") + f"""
    <section class="section container">
      <div class="two-col">
        <div class="prose reveal">
          <p>Fluid Glass began with a simple conviction: that glass, detailed properly, can change how a building feels. Where others see a window, we see structure, light and view held in tension.</p>
          <p>Every project is detailed, fabricated and installed by our own team — never subcontracted. That ownership is how we hold millimetre tolerances across twelve-metre spans.</p>
        </div>
        <div class="reveal"><img class="lazy-image" src="assets/images/product-windows.jpg" alt="Steel-look doors opening to a valley" style="width:100%;aspect-ratio:3/4;object-fit:cover"/></div>
      </div>
    </section>
    <section class="section container">
      <div class="stats reveal">
        <div class="stat"><div class="num">20+</div><div class="lbl">Years of practice</div></div>
        <div class="stat"><div class="num">640</div><div class="lbl">Projects delivered</div></div>
        <div class="stat"><div class="num">12m</div><div class="lbl">Max pane height</div></div>
      </div>
    </section>
    <section class="banner is-center"><div class="media"><img class="lazy-image" src="assets/images/duo-2.jpg" alt=""/></div>
      <div class="inner reveal"><span class="eyebrow">Work with us</span><h2>Bring us your hardest detail.</h2>
      <div class="btn-row"><a class="base-button is-white" href="contact/">Get a quote {ARROW}</a></div></div></section>
  </main>"""
write("about/index.html", page("About — Fluid Glass", "A specialist glazing studio engineering daylight and view into ambitious buildings.", about_body, "About", "about/"))


# ===================== COLLECTION =====================
collection_body = page_hero("Collection", "Four systems, engineered to vanish.", "Explore our core glazing families. Tap any system for the full specification.") + f"""
    <section class="section container">
      <div class="product-grid reveal">{product_cards()}</div>
    </section>
    <section class="banner is-center"><div class="media"><img class="lazy-image" src="assets/images/product-additional.jpg" alt=""/></div>
      <div class="inner reveal"><span class="eyebrow">Bespoke</span><h2>Something that doesn't exist yet?</h2>
      <p>We detail, test and make one-off glass pieces around your drawings.</p>
      <div class="btn-row"><a class="base-button is-white" href="contact/">Start a project {ARROW}</a></div></div></section>
  </main>"""
write("collection/index.html", page("Collection — Fluid Glass", "Structural glazing, pivot & sliding doors, steel-look windows, rooflights and bespoke glass.", collection_body, "Collection", "collection/", with_modal=True))


# ===================== PROJECTS =====================
PROJ = [("Ashmead Barn","Cotswolds","duo-1","wide"),("Keeper's Cottage","Surrey","duo-2",""),
        ("Meridian House","London","product-structural",""),("Valley View","Peak District","product-windows",""),
        ("The Glasshouse","Kent","showroom",""),("Coastal Retreat","Cornwall","product-additional",""),
        ("Forest Lodge","Hampshire","footer-bg",""),("Hillside Studio","Wales","hero-bg","wide")]
proj_cards = ""
for name, loc, img, wide in PROJ:
    proj_cards += f'<a class="project {wide}" href="contact/"><div class="media"><img class="lazy-image" src="assets/images/{img}.jpg" alt="{name}"/></div><div class="meta"><h3>{name}</h3><span class="loc">{loc}</span></div></a>'
projects_body = page_hero("Projects", "Built with vision.", "A selection of homes and buildings where glazing does the heavy lifting.") + f"""
    <section class="section container"><div class="projects-grid reveal">{proj_cards}</div></section>
  </main>"""
write("projects/index.html", page("Projects — Fluid Glass", "Featured glazing projects across the UK.", projects_body, "Projects", "projects/"))


# ===================== APPROACH =====================
STEPS = [("01","Survey & feasibility","We start on site — measuring, listening and pressure-testing the idea against structure, budget and building physics."),
         ("02","Engineering & detailing","Structural calculations and CAD detailing for every pane, bracket and joint, modelled before anything is cut."),
         ("03","Fabrication","Precision fabrication to millimetre tolerances, with finishes chosen to last decades, not seasons."),
         ("04","Installation & aftercare","Our own glaziers, lifting equipment and aftercare — never subcontracted, always accountable.")]
steps_html = ""
for n, t, d in STEPS:
    steps_html += f'<li><span class="fi">{n}</span><span class="ft"><strong>{t}</strong><span>{d}</span></span></li>'
approach_body = page_hero("Approach", "Detailed by engineers, finished by hand.", "One team owns your project from first survey to final joint. Here is how we work.") + f"""
    <section class="section container">
      <div class="two-col">
        <div class="reveal"><img class="lazy-image" src="assets/images/duo-1.jpg" alt="" style="width:100%;aspect-ratio:4/5;object-fit:cover"/></div>
        <ul class="feature-list reveal">{steps_html}</ul>
      </div>
    </section>
    <section class="banner is-center"><div class="media"><img class="lazy-image" src="assets/images/showroom.jpg" alt=""/></div>
      <div class="inner reveal"><span class="eyebrow">Start</span><h2>Let's begin with a conversation.</h2>
      <div class="btn-row"><a class="base-button is-white" href="contact/">Get a quote {ARROW}</a></div></div></section>
  </main>"""
write("approach/index.html", page("Approach — Fluid Glass", "Our process, from survey to installation.", approach_body, "Approach", "approach/"))


# ===================== SHOWROOM =====================
showroom_body = f"""
  <main>
    <section class="banner is-left" style="min-height:100svh">
      <div class="media"><img class="lazy-image" src="assets/images/showroom.jpg" alt="Architectural showroom of full-height glass partitions"/></div>
      <div class="inner reveal">
        <span class="eyebrow">The showroom</span>
        <h2>See, touch and open every system before you commit.</h2>
        <p>Full-scale glazing under real daylight — slide the doors, feel the sightlines and compare finishes with a specialist beside you.</p>
        <div class="btn-row"><a class="base-button is-white" href="contact/">Book a private visit {ARROW}</a></div>
      </div>
    </section>
    <section class="section container">
      <div class="two-col">
        <div class="prose reveal"><p>Our London showroom is open by appointment. Bring your drawings, your samples and your hardest detail — we will have the systems built at full height for you to test.</p>
        <p>Appointments run about an hour. Parking and refreshments provided.</p></div>
        <div class="reveal"><img class="lazy-image" src="assets/images/duo-2.jpg" alt="" style="width:100%;aspect-ratio:3/2;object-fit:cover"/></div>
      </div>
    </section>
  </main>"""
write("showroom/index.html", page("Showroom — Fluid Glass", "Visit the Fluid Glass showroom — full-scale glazing under real daylight.", showroom_body, "Showroom", "showroom/"))


# ===================== NEWS =====================
NEWS = [("Spanning twelve metres at Ashmead Barn","June 2026","duo-1"),
        ("Why low-iron glass changes everything","May 2026","product-structural"),
        ("Inside our new London showroom","April 2026","showroom"),
        ("Pivot doors: the engineering behind the swing","March 2026","product-doors"),
        ("Detailing frameless balustrades","Feb 2026","product-additional"),
        ("A year of glass: 2025 in review","Jan 2026","duo-2")]
news_cards = ""
for t, d, img in NEWS:
    news_cards += f'<a class="news-card" href="news/"><div class="media"><img class="lazy-image" src="assets/images/{img}.jpg" alt="{t}"/></div><div class="date">{d}</div><h3>{t}</h3></a>'
news_body = page_hero("News", "Notes from the studio.", "Project stories, material thinking and what we are learning along the way.") + f"""
    <section class="section container"><div class="news-grid reveal">{news_cards}</div></section>
  </main>"""
write("news/index.html", page("News — Fluid Glass", "Journal and news from Fluid Glass.", news_body, "News", "news/"))


# ===================== CONTACT =====================
contact_body = page_hero("Contact", "Get a quote.", "Tell us about your project. We reply to every enquiry within two working days.") + f"""
    <section class="section container">
      <div class="contact-grid">
        <form class="reveal" onsubmit="return false">
          <div class="field"><label for="name">Name</label><input id="name" name="name" type="text" autocomplete="name" /></div>
          <div class="field"><label for="email">Email</label><input id="email" name="email" type="email" autocomplete="email" /></div>
          <div class="field"><label for="project">About your project</label><textarea id="project" name="project" rows="4"></textarea></div>
          <button class="base-button is-black" type="submit">Send enquiry {ARROW}</button>
        </form>
        <div class="contact-info reveal">
          <div><span class="base-title">Email</span><br/><a class="big link-underline" href="mailto:hello@fluid.glass">hello@fluid.glass</a></div>
          <div><span class="base-title">Phone</span><br/><a class="big link-underline" href="tel:02081567290">020 8156 7290</a></div>
          <div><span class="base-title">Studio</span><p class="lead" style="margin-top:1rem">Unit 4, The Glassworks<br/>London, United Kingdom</p></div>
        </div>
      </div>
    </section>
  </main>"""
write("contact/index.html", page("Contact — Fluid Glass", "Get a quote from Fluid Glass — UK structural & architectural glazing specialists.", contact_body, "Contact", "contact/"))


# ===================== LEGAL =====================
def legal(title, body_paras):
    paras = "".join(f"<p>{p}</p>" for p in body_paras)
    b = page_hero(title, title + ".", "") + f"""
    <section class="section container"><div class="prose reveal">{paras}</div></section>
  </main>"""
    return b

write("privacy-policy/index.html", page("Privacy policy — Fluid Glass", "Fluid Glass privacy policy.",
      legal("Privacy policy", ["This placeholder privacy policy explains, in plain terms, how Fluid Glass would handle personal data submitted through this site.",
      "We collect only what you send us via the contact form, use it solely to respond to your enquiry, and never sell it.",
      "Replace this text with your finalised policy before going live."]), "Privacy", ""))

write("terms-conditions/index.html", page("Terms & conditions — Fluid Glass", "Fluid Glass terms and conditions.",
      legal("Terms & conditions", ["This placeholder terms page outlines the basis on which the Fluid Glass website is provided.",
      "Content is for general information; quotations are subject to survey and written agreement.",
      "Replace this text with your finalised terms before going live."]), "Terms", ""))


# ===================== 404 =====================
err_body = """
  <main class="error-page">
    <div>
      <span class="eyebrow" style="color:var(--color-grey);justify-content:center;display:inline-flex">Error 404</span>
      <div class="code">404</div>
      <p class="muted">The page you're looking for has slipped out of frame.</p>
      <a class="base-button is-black" href="%s">Back to home %s</a>
    </div>
  </main>""" % (BASE, ARROW)
write("404.html", page("Page not found — Fluid Glass", "Page not found.", err_body, "404", ""))

print("done")
