#!/usr/bin/env python3
"""Static site generator for Saansud Infra — assembles every page from one shared
shell (capsule header + menu overlay + intro + cursor + cookie + footer). Zero
runtime build; outputs plain HTML. Matte-luxury construction-company design."""
import os

BASE = "/Tgclint/"          # GitHub Pages project path; change to "/" for a root domain
ROOT = os.path.dirname(os.path.abspath(__file__))
WA = "https://wa.me/919178711798"
TEL = "tel:+919178711798"
EMAIL = "mailto:info@saansud.com"

MARK = ('<svg viewBox="0 0 42 42" fill="none" aria-hidden="true">'
        '<path d="M42 15.1935V10.5L21 0L0 10.5V31.5L21 42L42 31.5V19.95L25.2 11.55V23.2995L37.2435 29.1795L21 37.3065L4.2 28.9065V13.0935L21 4.6935L42 15.1935Z" fill="currentColor"/>'
        '<path d="M21 13.902V9.45L8.4 15.75V20.4435L21 13.902Z" fill="currentColor"/></svg>')
ARROW = ('<svg class="arrow-svg" viewBox="0 0 14 11" fill="none" aria-hidden="true">'
         '<path d="M8.5 1 13 5.5 8.5 10M13 5.5H1" stroke="currentColor" stroke-width="1.4"/></svg>')
BURGER = '<svg viewBox="0 0 20 11" fill="none" aria-hidden="true"><path d="M0 1h20M0 10h20" stroke="currentColor" stroke-width="1.4"/></svg>'
CLOSE = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" stroke="currentColor" stroke-width="1.6"/></svg>'

MAIN_NAV = [("About", "about/"), ("Construction", "construction/"),
            ("Projects", "projects/"), ("Interior", "interior/"), ("Contact", "contact/")]
SUB_NAV = [("Blog", "blog/"), ("Careers", "contact/"),
           ("+91 91787 11798", TEL), ("info@saansud.com", EMAIL)]


def head(title, desc):
    return f"""<!doctype html>
<html lang="en-IN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <base href="{BASE}" />
  <meta name="description" content="{desc}" />
  <meta name="author" content="Saansud Infra" />
  <meta name="robots" content="index, follow" />
  <meta property="og:site_name" content="Saansud Infra" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="{title}" />
  <meta property="og:description" content="{desc}" />
  <meta property="og:image" content="assets/images/hero-bg.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content="assets/images/hero-bg.jpg" />
  <link rel="canonical" href="https://www.saansud.com/" />
  <link rel="icon" type="image/svg+xml" href="assets/favicon.svg" />
  <link rel="preconnect" href="https://api.fontshare.com" crossorigin />
  <link href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&f[]=jetbrains-mono@500,600&display=swap" rel="stylesheet" />
  <title>{title}</title>
  <link rel="stylesheet" href="assets/css/design-system.css" />
  <link rel="stylesheet" href="assets/css/site.css" />
</head>
<body>"""


def intro():
    return f"""
  <div class="intro" role="presentation">
    <div class="logo">
      <div class="brandmark" style="color:var(--color-accent)">
        {MARK}
        <div class="cube"><div class="shape">
          <div class="face face-front"></div><div class="face face-back"></div>
          <div class="face face-right"></div><div class="face face-left"></div>
          <div class="face face-top"></div><div class="face face-bottom"></div>
        </div></div>
      </div>
      <div class="wordmark"><span style="font-family:var(--font-f-aeonik-mono);font-weight:600;font-size:2rem;letter-spacing:.16em;text-transform:uppercase;color:var(--color-grey)">Saansud</span></div>
    </div>
  </div>"""


def cursor():
    return '\n  <div class="cursor" aria-hidden="true"><div class="label">View</div></div>'


def transition():
    return f'\n  <div class="pt" aria-hidden="true"><div class="mk">{MARK}</div></div>'


def cookies():
    return f"""
  <div class="cookies" role="dialog" aria-label="Cookies">
    <span class="base-title">Cookies</span>
    <p class="text">We use cookies to enhance navigation, analyse usage and improve your experience. See our privacy policy for details.</p>
    <div class="buttons">
      <button class="base-button is-bronze" type="button" data-cookie="accept">Accept {ARROW}</button>
      <button class="base-button is-alpha" type="button" data-cookie="deny">Deny</button>
    </div>
  </div>"""


def header(title_text):
    return f"""
  <header class="header" aria-label="Primary">
    <a class="logo" href="{BASE}" aria-label="Saansud Infra — home">{MARK}</a>
    <div class="title" aria-hidden="true"><div class="title-inner" data-base="{title_text}">{title_text}</div></div>
    <button class="burger" type="button" aria-label="Open menu" aria-expanded="false">{BURGER}</button>
    <button class="close" type="button" aria-label="Close menu">{CLOSE}</button>
    <div class="background"></div>
  </header>"""


def menu(active):
    main_items = ""
    for label, href in MAIN_NAV:
        cls = " is-active" if href == active else ""
        main_items += f'<li class="item{cls}"><div class="mask"><a class="link" href="{href}">{label}</a></div></li>'
    sub_items = ""
    for label, href in SUB_NAV:
        ext = ' target="_blank" rel="noopener noreferrer"' if href.startswith(("tel:", "mailto:", "http")) else ""
        sub_items += f'<li class="mask"><a class="link" href="{href}"{ext}>{label}</a></li>'
    return f"""
  <div class="menu" aria-label="Menu">
    <nav class="nav">
      <div class="menu-title">Menu</div>
      <ul class="main">{main_items}</ul>
      <ul class="sub">{sub_items}</ul>
      <a class="base-button is-bronze" href="contact/">Get a free estimate {ARROW}</a>
    </nav>
    <div class="background"></div>
  </div>"""


def footer():
    cols = {
        "Company": [("About us", "about/"), ("Construction", "construction/"), ("Projects", "projects/"), ("Interior", "interior/")],
        "Resources": [("Blog", "blog/"), ("Careers", "contact/"), ("Privacy policy", "privacy-policy/"), ("Terms", "terms-conditions/")],
        "Connect": [("info@saansud.com", EMAIL), ("WhatsApp +91 91787 11798", WA), ("Bhubaneswar · Paradeep", "contact/"), ("Bangalore", "contact/")],
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
          <span class="brand" style="color:var(--color-accent)"><span class="mark"></span>Saansud&nbsp;Infra</span>
          <p class="lede">Transforming land into landmarks across Odisha and Bangalore — transparent costing, assured timelines and a 10-year structural warranty on every home.</p>
        </div>
        {col_html}
      </div>
      <div class="bottom">
        <span>© <span data-year>2026</span> Saansud Infra Pvt. Ltd. · CIN U41000OD2024PTC045712</span>
        <span>Build right. Live smart.</span>
      </div>
    </div>
  </footer>"""


def scripts():
    return """
  <script src="https://unpkg.com/lenis@1.1.13/dist/lenis.min.js"></script>
  <script src="assets/js/main.js"></script>
</body>
</html>"""


def page_header_bar(label, variant):
    cls = "page-header" + ("" if variant == "white" else " is-dark")
    return (f'<section class="{cls}"><a class="logo" href="{BASE}" style="--mk:var(--color-accent)">'
            f'<span class="mark" style="background:var(--color-accent)"></span>Saansud&nbsp;Infra</a><h1>{label}</h1>'
            f'<a class="base-button is-bronze" href="contact/">Get a free estimate</a></section>')


def page(title, desc, body, title_text, active, ph="dark", label=None):
    bar = page_header_bar(label or title_text, ph)
    return (head(title, desc) + intro() + cursor() + transition() + cookies() + bar + header(title_text) +
            menu(active) + body + footer() + scripts())


def write(path, html):
    full = os.path.join(ROOT, path)
    if os.path.dirname(full):
        os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w") as f:
        f.write(html)
    print("wrote", path)


def page_hero(eyebrow, title, sub):
    return f"""
  <main>
    <section class="page-hero">
      <span class="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p class="sub">{sub}</p>
    </section>"""


# ---- shared data ---------------------------------------------------------
WHY = [("01", "Transparent dealings", "Open pricing, documented processes and no hidden charges — you always know where every rupee goes."),
       ("02", "Assured quality", "Branded materials, multi-stage quality checks and a 10-year structural warranty on every build."),
       ("03", "Ideal locations", "Developed-land societies near IIT Bhubaneswar, Paradeep and Jagatsinghpur with real appreciation potential."),
       ("04", "Fair, fixed price", "Three clear packages and realistic payment plans, so your budget and timeline are protected from day one.")]

PACKAGES = [
    dict(name="Standard", tier="Value with quality", feat=[
        "2D floor plans & 3D elevations", "Fe500/550 TMT steel · 53/43 grade cement",
        "Flooring up to ₹45/sq.ft · M20 RMC", "Teak main door up to ₹22,000",
        "2-track aluminium windows", "10-year structural warranty"], featured=False),
    dict(name="Premium", tier="Enhanced quality", feat=[
        "Complete design package", "Indus / Prime Gold steel · ACC/Zuari cement",
        "Flooring up to ₹70/sq.ft", "UPVC windows with MS grill",
        "EV charging point · rainwater harvesting", "Premium teak door up to ₹30,000"], featured=True),
    dict(name="Luxury", tier="Ultimate excellence", feat=[
        "JSW / Tata steel · M25 concrete", "Flooring up to ₹120/sq.ft · 10.5ft ceilings",
        "3-track UPVC or Sal-wood frames", "Jaquar / Grohe / Toto fixtures",
        "Designer gate & SS railings", "Premium doors ₹35,000+"], featured=False),
]

PROJECTS = [
    ("Saansud Laxmi Narayan Vihar", "Bhubaneswar", "2.7 Acres|114 Units|1,510 sq.ft avg", "From ₹10 Lac", "hero-bg"),
    ("Mahaveer Enclave", "Jagatsinghpur", "4.2 Acres|112 Units|1,360 sq.ft avg", "From ₹11 Lac", "duo-2"),
    ("Mahaveer Nagar", "Paradeep", "3.4 Acres|86 Units|1,220 sq.ft avg", "From ₹10 Lac", "duo-1"),
    ("IIT Bhubaneswar Project", "Near IIT Bhubaneswar", "3.1 Acres|107 Units|1,430 sq.ft avg", "From ₹15 Lac", "showroom"),
]

TESTI = [
    ("From project initiation to completion, the team showed the highest levels of professionalism, technical expertise and commitment to quality. They turned my dream palace into reality.", "Prangyamayee Panda", "Mancheswar, Bhubaneswar"),
    ("Saansud handled both my housing and office projects with excellence. From architecture to interiors and final handover, their end-to-end service was seamless and top quality.", "Rajendra Das", "Bhutmudei, Kujanga"),
    ("They helped me find a suitable plot and ensured a smooth, end-to-end process in constructing my dream home. Truly a dependable partner in home building.", "Padmavati Choudhury", "Mahaveer Nagar, Paradeep"),
    ("The project is progressing smoothly, with full dedication and within budget. Truly a dependable team.", "Smarak Mohapatra", "Hanspal, Bhubaneswar"),
    ("They helped me with the bank-loan process and are ensuring smooth progress in construction. A truly dependable partner for home building.", "Sakti Sankar Behera", "Mahaveer Nagar, Paradeep"),
]

BLOG = [
    dict(slug="sasta-ru-hinasta", cat="Construction economics", read="8 min read", img="product-structural",
         title='The "Sasta ru Hinasta" trap: why self-building your home is a costly illusion',
         lede="Self-managing labour looks cheaper on day one. By handover, hidden leakages in materials, time and stress have pushed most homeowners far past what a professional build would have cost.",
         body=[
            ("The illusion of the daily-wage saving", [
                "In Odia we say <em>sasta ru hinasta</em> — what looks cheap turns out to be the most expensive thing of all. Nowhere is this truer than in home construction. Hiring a mason on a daily wage and buying your own cement feels like you are cutting out the middleman and pocketing his margin.",
                "But a contractor's margin is not a tax on your project. It is the price of someone whose full-time job is to stop your money leaking away — and on an unmanaged site, it leaks in a dozen quiet ways."]),
            ("Where the money actually goes", [
                "Material waste and pilferage are the first leak. Steel cut wrong, cement left to harden in the rain, tiles over-ordered or quietly walking off site — without a professional counting every bag and bar, 5–15% of your material budget simply evaporates.",
                "Rework is the second. An amateur-supervised slab poured a centimetre out of level, a damp-proof course missed, a conduit laid in the wrong wall — each mistake is paid for twice, once to build and once to break and rebuild."]),
            ("The cost of your own time", [
                "Then there is your time. Self-managing a build is a second full-time job: chasing suppliers, settling disputes between trades, standing at the site gate at 7am. Most homeowners take months of effective leave from their real careers — a cost that never appears on the estimate but is very real."]),
            ("What professional management actually buys", [
                "A managed build replaces all of that with a fixed scope, a fixed price and a single point of accountability. Materials are scheduled and inspected, trades are sequenced so nobody waits, and quality is checked at every stage rather than discovered at the end.",
                "The honest comparison is rarely \"professional vs. cheap\". It is \"a predictable price now\" vs. \"an unpredictable, usually higher price later\" — plus your weekends back."]),
         ]),
    dict(slug="hidden-health-cost", cat="Homeowner wellness", read="7 min read", img="duo-2",
         title="The hidden health cost of building a house: why your peace of mind is worth more than a discount",
         lede="The real cost of a self-managed build is not just money. It is decision fatigue, disrupted work and months of low-grade stress — a tax you pay with your wellbeing.",
         body=[
            ("A thousand small decisions", [
                "Building a house is not one big decision; it is a thousand small ones, every single day. Which brand of putty? Is this the right shade of grey? Why is the plumber arguing with the electrician? Each is minor on its own. Together, over many months, they produce a very real condition psychologists call decision fatigue."]),
            ("Disruption to your real life", [
                "Site problems do not wait for the weekend. They arrive by phone at the worst possible moment — mid-meeting, mid-dinner, mid-holiday. Slowly the project colonises your calendar, your conversations and your sleep."]),
            ("The toll you can't put on a spreadsheet", [
                "Ask anyone who has self-managed a build and they will tell you about the months of poor sleep, the short temper, the strain on the family. None of it shows up on the cost sheet, but all of it is paid in full."]),
            ("Peace of mind is a measurable asset", [
                "Outsourcing your build to a professional project-management team is not a luxury — it is buying back your evenings, your focus and your health. The discount you might win by doing it yourself is almost never worth what it quietly takes out of you.",
                "A home should be the calmest thing you ever build, not the most stressful. That is the standard we hold ourselves to."]),
         ]),
    dict(slug="land-to-landmark", cat="Quality assurance", read="10 min read", img="duo-1",
         title="Transforming land into a landmark: the foundation of trust at Saansud Infra",
         lede="A plot is potential. A landmark is potential made permanent — through a real structural warranty, verifiable quality and design rooted in how families actually live.",
         body=[
            ("A home is a fifty-year decision", [
                "Most purchases you make are for a season. A home is for generations. That changes everything about how it should be built — the question is never just \"will it look good at handover?\" but \"will it still be standing strong, and feeling like home, when your grandchildren inherit it?\""]),
            ("A warranty that actually means something", [
                "We back every home with a 10-year structural warranty. A warranty is only as good as the build behind it, which is why we put our name on the structure itself — branded steel, graded cement, M20–M25 concrete and waterproofing detailed to last."]),
            ("Quality you can verify, not just trust", [
                "Trust should be earned with evidence, not asked for on faith. Soil is tested before design. Materials are inspected on delivery. Every stage — foundation, slab, brickwork, finishes — is checked by our own quality controllers before the next begins, and documented so you can see it."]),
            ("Designed for how Odisha actually lives", [
                "A landmark home respects its place. We design for the climate, the light and the way families here gather — from the pooja room to the courtyard to the parking — so the house feels rooted, not imported."]),
            ("From plot to legacy", [
                "That is what it means to turn land into a landmark: not just a structure on a survey number, but a long-term family legacy you can hand down with pride. It is the foundation of trust everything else at Saansud is built on."]),
         ]),
]


def trust_bar():
    items = [("20+", "Years of excellence"), ("17.45M+", "Sq.ft delivered"), ("9+", "Projects completed"), ("1000+", "Happy families")]
    lis = "".join(f'<div class="ti"><b>{n}</b><span>{l}</span></div>' for n, l in items)
    return f'<div class="trust-bar">{lis}</div>'


def why_section():
    cards = "".join(f'<div class="why-card reveal"><span class="n">{n}</span><h3>{t}</h3><p>{d}</p></div>' for n, t, d in WHY)
    return f"""
    <section class="section container">
      <div class="section-head reveal"><div><span class="base-title" style="margin-bottom:2rem">Why Saansud</span><h2>Reasons families<br/>choose us.</h2></div>
        <p class="muted lead" style="max-width:40ch">Four promises that protect your budget, your timeline and your peace of mind.</p></div>
      <div class="why-grid">{cards}</div>
    </section>"""


def package_cards(cta="Get a quote"):
    out = ""
    for p in PACKAGES:
        feats = "".join(f"<li>{f}</li>" for f in p["feat"])
        badge = '<span class="badge">Most popular</span>' if p["featured"] else ""
        btn = "is-bronze" if p["featured"] else "is-white"
        out += (f'<div class="package{" featured" if p["featured"] else ""} reveal">{badge}'
                f'<span class="tier">{p["tier"]}</span><h3>{p["name"]}</h3>'
                f'<span class="price">Project-based pricing</span><ul>{feats}</ul>'
                f'<a class="base-button {btn}" href="contact/">{cta} {ARROW}</a></div>')
    return out


def project_cards(limit=None):
    items = PROJECTS[:limit] if limit else PROJECTS
    out = ""
    for name, loc, specs, price, img in items:
        sp = "".join(f"<span>{s}</span>" for s in specs.split("|"))
        out += (f'<a class="project reveal" href="contact/"><div class="media"><img class="lazy-image" src="assets/images/{img}.jpg" alt="{name}"/></div>'
                f'<div class="specs">{sp}</div>'
                f'<div class="meta"><h3>{name}</h3><span class="loc">{loc}</span></div>'
                f'<div class="meta" style="padding-top:0"><span class="price">{price}</span><span class="loc">Developed land · society</span></div></a>')
    return out


def testi_cards(limit=None):
    items = TESTI[:limit] if limit else TESTI
    return "".join(f'<div class="testi reveal"><p>“{q}”</p><div class="who">{a}<span>{loc}</span></div></div>' for q, a, loc in items)


def blog_cards(limit=None):
    items = BLOG[:limit] if limit else BLOG
    out = ""
    for d in items:
        out += (f'<a class="blog-card reveal" href="blog/{d["slug"]}/"><div class="media"><span class="cat">{d["cat"]}</span>'
                f'<img class="lazy-image" src="assets/images/{d["img"]}.jpg" alt="{d["title"]}"/></div>'
                f'<div class="body"><h3>{d["title"]}</h3><p>{d["lede"][:130]}…</p>'
                f'<div class="meta"><span>{d["read"]}</span></div><span class="more">Read story →</span></div></a>')
    return out


# ===================== HOME =====================
home_body = f"""
  <main>
    <section class="home-header" data-name="Saansud Infra">
      <div class="background"><img class="lazy-image" src="assets/images/hero-bg.jpg" alt="A completed Saansud home at dusk" /></div>
      <div class="container">
        <div class="row">
          <p class="base-heading">Build right.<br/>Live smart.</p>
          <div class="indicator" aria-hidden="true">Scroll to explore</div>
        </div>
        <p class="text">Transform your land into a landmark home — with transparent costing, assured quality and end-to-end execution across Odisha and Bangalore.</p>
        <div class="hero-cta">
          <a class="base-button is-bronze" href="contact/">Get a free estimate {ARROW}</a>
          <a class="base-button is-white" href="projects/">Explore projects {ARROW}</a>
        </div>
        {trust_bar()}
      </div>
    </section>

    <section class="section container" data-name="About">
      <div class="text-cta reveal">
        <span class="base-title">About Saansud Infra</span>
        <p class="base-heading">We turn plots into <em>generational homes</em> — engineered with transparency, built with care and backed by a 10-year warranty.</p>
        <div class="btn-row"><a class="base-button is-black" href="about/">Who we are {ARROW}</a></div>
      </div>
    </section>

    <section class="scale-sec" data-name="Craft">
      <div class="frame">
        <img class="lazy-image" src="assets/images/duo-1.jpg" alt="A Saansud home coming to life" />
        <div class="cap"><span class="eyebrow">Land into landmarks</span><h2>Watch your plot become a home you'll never want to leave.</h2></div>
      </div>
    </section>

    {why_section()}

    <section class="section container packages" data-name="Packages">
      <div class="section-head reveal"><div><span class="base-title" style="margin-bottom:2rem">Construction packages</span><h2>Three tiers,<br/>one standard of care.</h2></div>
        <p class="lead" style="max-width:40ch;color:color-mix(in srgb,var(--color-cream) 70%, transparent)">Pick the specification that fits your budget — every package is fixed-cost and fully transparent.</p></div>
      <div class="packages-grid">{package_cards()}</div>
    </section>

    <section class="section container" data-name="Projects">
      <div class="section-head reveal"><div><span class="base-title" style="margin-bottom:2rem">Featured projects</span><h2>Transforming land<br/>into landmarks.</h2></div>
        <p class="muted lead" style="max-width:40ch">Developed-land societies across Bhubaneswar, Paradeep and Jagatsinghpur.</p></div>
      <div class="projects-grid">{project_cards(limit=4)}</div>
    </section>

    <section class="banner is-left" data-name="Interior">
      <div class="media"><img class="lazy-image" src="assets/images/showroom.jpg" alt="A Saansud interior fit-out"/></div>
      <div class="inner reveal">
        <span class="eyebrow">Interior designing</span>
        <h2>From bare shell to a home you'll love living in.</h2>
        <p>Kitchens, wardrobes, lighting and finishes designed and delivered with the same transparency as our construction — flat design fees, any budget.</p>
        <div class="btn-row"><a class="base-button is-white" href="interior/">Explore interiors {ARROW}</a></div>
      </div>
    </section>

    <section class="section container testimonials" data-name="Reviews">
      <div class="section-head reveal"><div><span class="base-title" style="margin-bottom:2rem">Testimonials</span><h2>Trusted by 1000+<br/>families.</h2></div></div>
      <div class="testi-grid">{testi_cards(limit=3)}</div>
    </section>

    <section class="section container" data-name="Blog">
      <div class="section-head reveal"><div><span class="base-title" style="margin-bottom:2rem">Insights</span><h2>Build with confidence.</h2></div>
        <p class="muted lead" style="max-width:40ch">Practical, no-nonsense guidance for homeowners who want to avoid costly mistakes.</p></div>
      <div class="blog-grid">{blog_cards(limit=3)}</div>
    </section>

    <section class="banner is-center" id="contact" data-name="Contact">
      <div class="media"><img class="lazy-image" src="assets/images/footer-bg.jpg" alt="A Saansud living space at golden hour"/></div>
      <div class="inner reveal">
        <span class="eyebrow">Start your project</span>
        <h2>Let's build your landmark home.</h2>
        <div class="btn-row"><a class="base-button is-bronze" href="contact/">Get a free estimate {ARROW}</a>
        <a class="base-button is-white" href="{WA}" target="_blank" rel="noopener noreferrer">WhatsApp us {ARROW}</a></div>
      </div>
    </section>
  </main>"""

write("index.html", page("Saansud Infra — Build Right. Live Smart. | Home Construction in Odisha",
      "Saansud Infra builds transparent, fixed-cost homes across Odisha and Bangalore — 17.45M+ sq.ft delivered, 10-year structural warranty.",
      home_body, "Saansud Infra", "", ph="white", label="Saansud Infra"))


# ===================== ABOUT =====================
about_body = page_hero("About", "A studio built on trust.", "Saansud Infra Pvt. Ltd. turns land into landmarks across Odisha and Bangalore — with 100% ownership, transparent dealings and assured timelines.") + f"""
    <section class="section container">
      <div class="two-col">
        <div class="prose reveal">
          <p>Founded in 2024 and built on two decades of construction experience, Saansud Infra acts as your single point of accountability — overseeing architects, engineers, supervisors and quality controllers so you never have to.</p>
          <p>We are committed to excellence, transparency, quality assurance and environmentally responsible building — delivering every project on schedule, without compromising on quality or budget.</p>
        </div>
        <div class="reveal"><img class="lazy-image" src="assets/images/duo-2.jpg" alt="A completed Saansud residence" style="width:100%;aspect-ratio:3/4;object-fit:cover"/></div>
      </div>
    </section>
    <section class="section container">
      <div class="stats reveal">
        <div class="stat"><div class="num">20+</div><div class="lbl">Years of excellence</div></div>
        <div class="stat"><div class="num">17.45M+</div><div class="lbl">Sq.ft delivered</div></div>
        <div class="stat"><div class="num">9+</div><div class="lbl">Projects completed</div></div>
      </div>
    </section>
    {why_section()}
    <section class="section container">
      <div class="section-head reveal"><div><span class="base-title" style="margin-bottom:2rem">Leadership</span><h2>The people behind Saansud.</h2></div></div>
      <div class="two-col reveal">
        <div class="prose"><h3 style="font-family:var(--font-f-aeonik-pro);font-weight:400;font-size:2.4rem;color:var(--color-black)">Sitanshu Mohapatra</h3>
        <p class="muted" style="font-family:var(--font-f-aeonik-mono);font-size:1.2rem;letter-spacing:.08em;text-transform:uppercase">CEO &amp; Founder · Bhubaneswar</p>
        <p>Leads the company's vision and strategic direction across the Bhubaneswar and Bangalore offices — known for turning customers' dreams into reality.</p></div>
        <div class="prose"><h3 style="font-family:var(--font-f-aeonik-pro);font-weight:400;font-size:2.4rem;color:var(--color-black)">Umakanta Parija</h3>
        <p class="muted" style="font-family:var(--font-f-aeonik-mono);font-size:1.2rem;letter-spacing:.08em;text-transform:uppercase">Director</p>
        <p>Manages day-to-day operations and project management, keeping every site on track across Odisha.</p></div>
      </div>
    </section>
    <section class="banner is-center"><div class="media"><img class="lazy-image" src="assets/images/duo-1.jpg" alt=""/></div>
      <div class="inner reveal"><span class="eyebrow">Work with us</span><h2>Build with a team you can trust.</h2>
      <div class="btn-row"><a class="base-button is-bronze" href="contact/">Get a free estimate {ARROW}</a></div></div></section>
  </main>"""
write("about/index.html", page("About — Saansud Infra", "Saansud Infra: 20+ years, 17.45M+ sq.ft delivered, led by Sitanshu Mohapatra. Transparent, quality-assured home construction.", about_body, "About", "about/"))


# ===================== CONSTRUCTION =====================
SERVICES = [("Building construction", "Residential homes from 2D plans and 3D elevations to structural drawings, working drawings and full execution."),
            ("Architecture & design", "Site-specific design reflecting your style, with building-code compliance and government liaison."),
            ("Renovation", "Reflooring, painting, kitchen and bathroom upgrades and complete remodelling, planned around your life."),
            ("Contracting", "Material sourcing, labour management and quality control with strict timeline and budget adherence.")]
svc_html = "".join(f'<li><span class="fi">{str(i+1).zfill(2)}</span><span class="ft"><strong>{t}</strong><span>{d}</span></span></li>' for i, (t, d) in enumerate(SERVICES))
construction_body = page_hero("Construction", "End-to-end home construction.", "From government sanction to final handover, a single accountable team delivers your home on time and on budget.") + f"""
    <section class="section container">
      <div class="two-col">
        <div class="reveal"><img class="lazy-image" src="assets/images/product-structural.jpg" alt="Saansud construction in progress" style="width:100%;aspect-ratio:4/5;object-fit:cover"/></div>
        <ul class="feature-list reveal">{svc_html}</ul>
      </div>
    </section>
    <section class="section container packages">
      <div class="section-head reveal"><div><span class="base-title" style="margin-bottom:2rem">Packages</span><h2>Standard, Premium<br/>&amp; Luxury.</h2></div>
        <p class="lead" style="max-width:40ch;color:color-mix(in srgb,var(--color-cream) 70%, transparent)">Fixed-cost packages with branded materials and a 10-year structural warranty across all tiers.</p></div>
      <div class="packages-grid">{package_cards(cta="Get this quote")}</div>
    </section>
    <section class="section container">
      <div class="prose reveal" style="max-width:72rem">
        <span class="base-title">Also handled for you</span>
        <p>Government sanction across all approving bodies (BDA, CDA, Panchayat, Tahasil), temporary &amp; permanent electricity, water and sewage connections, soil testing, site supervision and material quality assurance.</p>
      </div>
    </section>
  </main>"""
write("construction/index.html", page("Construction & packages — Saansud Infra", "Standard, Premium and Luxury home-construction packages with transparent, fixed-cost pricing and a 10-year structural warranty.", construction_body, "Construction", "construction/"))


# ===================== PROJECTS =====================
def project_panels():
    out = ('<div class="lead-panel"><span class="base-title">Featured projects</span>'
           '<h2>Transforming land into landmarks.</h2>'
           '<span class="scroll-hint">Scroll to explore &rarr;</span></div>')
    for name, loc, specs, price, img in PROJECTS:
        sp = "".join(f"<span>{s}</span>" for s in specs.split("|"))
        out += (f'<a class="panel" href="contact/"><div class="media"><img class="lazy-image" src="assets/images/{img}.jpg" alt="{name}"/></div>'
                f'<div class="specs">{sp}</div>'
                f'<div class="meta"><h3>{name}</h3><span class="loc">{loc}</span></div>'
                f'<div class="meta"><span class="price">{price}</span><span class="loc">Developed land</span></div></a>')
    return out


projects_body = page_hero("Projects", "Land into landmarks.", "Developed-land societies and homes across Bhubaneswar, Paradeep and Jagatsinghpur. Scroll sideways to explore each one.") + f"""
    <section class="hscroll"><div class="sticky"><div class="track">{project_panels()}</div></div></section>
    <section class="banner is-center"><div class="media"><img class="lazy-image" src="assets/images/footer-bg.jpg" alt=""/></div>
      <div class="inner reveal"><span class="eyebrow">Find your plot</span><h2>Plots, finance and construction — one partner.</h2>
      <div class="btn-row"><a class="base-button is-bronze" href="{WA}" target="_blank" rel="noopener noreferrer">WhatsApp +91 91787 11798 {ARROW}</a></div></div></section>
  </main>"""
write("projects/index.html", page("Projects — Saansud Infra", "Saansud developed-land societies: Laxmi Narayan Vihar, Mahaveer Enclave, Mahaveer Nagar and the IIT Bhubaneswar project.", projects_body, "Projects", "projects/"))


# ===================== INTERIOR =====================
interior_body = f"""
  <main>
    <section class="banner is-left" style="min-height:100svh">
      <div class="media"><img class="lazy-image" src="assets/images/showroom.jpg" alt="Saansud interior design"/></div>
      <div class="inner reveal">
        <span class="eyebrow">Interior designing</span>
        <h2>Interiors that feel like home, finished like a showroom.</h2>
        <p>Complete interior solutions — kitchens, wardrobes, lighting, colour and space planning — delivered with flat, transparent design fees for any style or budget.</p>
        <div class="btn-row"><a class="base-button is-bronze" href="contact/">Plan my interiors {ARROW}</a></div>
      </div>
    </section>
    <section class="section container">
      <div class="two-col">
        <div class="prose reveal"><p>We collaborate with some of Bangalore's most respected interior designers, then execute with the same accountability as our construction team — one point of contact from concept to handover.</p>
        <p>Kitchen and bathroom design, furniture planning, lighting design, colour consultation and space optimisation, all under one roof.</p></div>
        <div class="reveal"><img class="lazy-image" src="assets/images/product-additional.jpg" alt="A finished Saansud interior" style="width:100%;aspect-ratio:3/2;object-fit:cover"/></div>
      </div>
    </section>
  </main>"""
write("interior/index.html", page("Interior designing — Saansud Infra", "Complete interior solutions — kitchens, wardrobes, lighting and finishes — with flat, transparent design fees.", interior_body, "Interior", "interior/"))


# ===================== BLOG =====================
blog_body = page_hero("Blog", "Build with confidence.", "Practical, conversion-focused guidance for homeowners who want to avoid costly construction mistakes.") + f"""
    <section class="section container"><div class="blog-grid reveal">{blog_cards()}</div></section>
  </main>"""
write("blog/index.html", page("Blog — Saansud Infra", "Construction insights and homeowner guidance from Saansud Infra.", blog_body, "Blog", "blog/"))


def story_card(d):
    return (f'<a class="blog-card reveal" href="blog/{d["slug"]}/"><div class="media"><span class="cat">{d["cat"]}</span>'
            f'<img class="lazy-image" src="assets/images/{d["img"]}.jpg" alt="{d["title"]}"/></div>'
            f'<div class="body"><h3>{d["title"]}</h3><p>{d["lede"][:130]}…</p>'
            f'<div class="meta"><span>{d["read"]}</span></div><span class="more">Read story →</span></div></a>')


for _i, _d in enumerate(BLOG):
    _secs = ""
    for _sub, _paras in _d["body"]:
        _secs += f'<h2 class="story-h">{_sub}</h2>' + "".join(f"<p>{_p}</p>" for _p in _paras)
    _next = BLOG[(_i + 1) % len(BLOG)]
    _story = f"""
  <main>
    <article class="story">
      <div class="story-hero">
        <span class="eyebrow">{_d['cat']} · {_d['read']}</span>
        <h1>{_d['title']}</h1>
        <p class="story-lede">{_d['lede']}</p>
      </div>
      <div class="story-media reveal"><img class="lazy-image" src="assets/images/{_d['img']}.jpg" alt="{_d['title']}"/></div>
      <div class="story-body">
        {_secs}
        <div class="btn-row" style="margin-top:3.2rem"><a class="base-button is-bronze" href="contact/">Get a free estimate {ARROW}</a></div>
      </div>
    </article>
    <section class="section container">
      <div class="section-head reveal"><div><span class="base-title" style="margin-bottom:2rem">Next story</span></div>
        <a class="base-button is-alpha" href="blog/">All stories</a></div>
      <div class="blog-grid reveal" style="grid-template-columns:1fr">{story_card(_next)}</div>
    </section>
  </main>"""
    write(f"blog/{_d['slug']}/index.html",
          page(f"{_d['title']} — Saansud Infra", _d['lede'][:155], _story, _d['cat'], "blog/"))


# ===================== CONTACT =====================
contact_body = page_hero("Contact", "Get a free estimate.", "Tell us about your land and your plans. We reply to every enquiry within two working days.") + f"""
    <section class="section container">
      <div class="contact-grid">
        <form class="reveal" onsubmit="return false">
          <div class="field"><label for="name">Name</label><input id="name" name="name" type="text" autocomplete="name" /></div>
          <div class="field"><label for="phone">Phone / WhatsApp</label><input id="phone" name="phone" type="tel" autocomplete="tel" /></div>
          <div class="field"><label for="loc">Plot location</label><input id="loc" name="loc" type="text" /></div>
          <div class="field"><label for="project">About your project</label><textarea id="project" name="project" rows="4"></textarea></div>
          <button class="base-button is-bronze" type="submit">Send enquiry {ARROW}</button>
        </form>
        <div class="contact-info reveal">
          <div><span class="base-title">WhatsApp</span><br/><a class="big link-underline" href="{WA}" target="_blank" rel="noopener noreferrer">+91 91787 11798</a></div>
          <div><span class="base-title">Email</span><br/><a class="big link-underline" href="{EMAIL}">info@saansud.com</a></div>
          <div><span class="base-title">Registered office</span><p class="lead" style="margin-top:1rem">Plot No-340768, Kothiasah, Kujang,<br/>Jagatsinghpur, Odisha 754141</p></div>
          <div><span class="base-title">Offices</span><p class="lead" style="margin-top:1rem">Bhubaneswar · Paradeep · Kujanga · Bangalore</p></div>
        </div>
      </div>
    </section>
  </main>"""
write("contact/index.html", page("Contact — Saansud Infra", "Get a free estimate from Saansud Infra. WhatsApp +91 91787 11798 or email info@saansud.com.", contact_body, "Contact", "contact/"))


# ===================== LEGAL =====================
def legal(title, paras):
    body = page_hero(title, title + ".", "") + (
        '<section class="section container"><div class="prose reveal">'
        + "".join(f"<p>{p}</p>" for p in paras) + "</div></section></main>")
    return body

write("privacy-policy/index.html", page("Privacy policy — Saansud Infra", "Saansud Infra privacy policy.",
      legal("Privacy policy", ["This placeholder privacy policy explains how Saansud Infra would handle personal data submitted through this site.",
      "We collect only what you send us via the enquiry form or WhatsApp, use it solely to respond to your enquiry, and never sell it.",
      "Replace this text with your finalised policy before going live."]), "Privacy", ""))

write("terms-conditions/index.html", page("Terms & conditions — Saansud Infra", "Saansud Infra terms and conditions.",
      legal("Terms & conditions", ["This placeholder terms page outlines the basis on which the Saansud Infra website is provided.",
      "Content is for general information; quotations are subject to site survey and a written agreement.",
      "Replace this text with your finalised terms before going live."]), "Terms", ""))


# ===================== 404 =====================
err_body = """
  <main class="error-page">
    <div>
      <span class="eyebrow" style="color:var(--color-grey);justify-content:center;display:inline-flex">Error 404</span>
      <div class="code">404</div>
      <p class="muted">This page hasn't been built yet.</p>
      <a class="base-button is-bronze" href="%s">Back to home %s</a>
    </div>
  </main>""" % (BASE, ARROW)
write("404.html", page("Page not found — Saansud Infra", "Page not found.", err_body, "404", ""))

print("done")
