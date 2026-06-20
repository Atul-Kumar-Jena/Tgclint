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

S_PATH = ("M74 32C74 21 63 16 50 16C35 16 29 25 29 35C29 47 43 50 52 52"
          "C66 56 74 60 74 70C74 83 62 88 49 88C35 88 28 81 28 71")
# Saansud "S" monogram (placeholder for the real brand logo)
MARK = (f'<svg viewBox="0 0 100 100" fill="none" aria-hidden="true">'
        f'<path pathLength="100" d="{S_PATH}" stroke="currentColor" stroke-width="11" stroke-linecap="round"/></svg>')
MARK_MINI = f'<span class="brandmark-mini">{MARK}</span>'
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
    <div class="intro-grid"></div>
    <div class="logo">
      <span class="intro-mark">{MARK}</span>
      <div class="wordmark"><span class="wm">Saansud</span><span class="tag">Building Landmarks</span></div>
    </div>
  </div>"""


def cursor():
    return '\n  <div class="cursor" aria-hidden="true"><div class="label">View</div></div>'


def transition():
    return (f'\n  <div class="scroll-progress" data-scroll-progress></div>'
            f'\n  <div class="pt" aria-hidden="true"><div class="mk">{MARK}</div></div>')


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
          <span class="brand" style="color:var(--color-accent)">{MARK_MINI}Saansud&nbsp;Infra</span>
          <p class="lede">We turn land into landmarks across Odisha &amp; Bangalore. <span class="hl">Fixed price, fixed timeline, 10-year warranty</span> &mdash; in writing.</p>
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
    return (f'<section class="{cls}"><a class="logo" href="{BASE}">'
            f'{MARK_MINI}Saansud&nbsp;Infra</a><h1>{label}</h1>'
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
WHY = [("01", "Every rupee, accounted for", "Open pricing, documented at every step. You always know where your money goes."),
       ("02", "Branded materials. Real warranty.", "Graded steel and cement, multi-stage checks, and a 10-year structural warranty in writing."),
       ("03", "Plots that appreciate", "Developed-land societies near IIT Bhubaneswar, Paradeep and Jagatsinghpur — bought right."),
       ("04", "One price. No surprises.", "Three clear packages and realistic payment plans. Your budget is protected from day one.")]

PACKAGES = [
    dict(name="Standard", tier="Solid, honest, built to last", feat=[
        "2D floor plans & 3D elevations", "Fe500/550 TMT steel · 53/43 grade cement",
        "Flooring up to ₹45/sq.ft · M20 RMC", "Teak main door up to ₹22,000",
        "2-track aluminium windows", "10-year structural warranty"], featured=False),
    dict(name="Premium", tier="More finish, more comfort", feat=[
        "Complete design package", "Indus / Prime Gold steel · ACC/Zuari cement",
        "Flooring up to ₹70/sq.ft", "UPVC windows with MS grill",
        "EV charging point · rainwater harvesting", "Premium teak door up to ₹30,000"], featured=True),
    dict(name="Luxury", tier="Nothing held back", feat=[
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
SERVICE_CARDS = [
    ("01 — Construction", "Building construction", "From 2D plans to final handover — structural drawings, working drawings and full execution by one accountable team.", "product-structural", "construction/", True),
    ("02 — Interiors", "Interior designing", "Kitchens, wardrobes, lighting and finishes, delivered with flat, transparent design fees for any budget.", "showroom", "interior/", True),
    ("03 — Renovation", "Renovation &amp; remodel", "Reflooring, painting, kitchen and bathroom upgrades and complete remodelling, planned around your life.", "product-additional", "construction/", False),
    ("04 — Architecture", "Architecture &amp; approvals", "Site-specific design plus government sanction, electricity, water and sewage liaison — handled for you.", "product-windows", "construction/", False),
]


def service_cards():
    out = ""
    for idx, title, desc, img, href, tall in SERVICE_CARDS:
        t = " tall" if tall else ""
        out += f"""
          <article class="product-card{t}">
            <a class="card-link" href="{href}" aria-label="{title}"></a>
            <div class="media"><img class="lazy-image" src="assets/images/{img}.jpg" alt="{title}" /></div>
            <div class="product-body">
              <span class="idx">{idx}</span>
              <h3>{title}</h3>
              <p>{desc}</p>
              <span class="product-more">Discover <span class="arrow">&rarr;</span></span>
            </div>
          </article>"""
    return out


STORY_QUOTES = {
    "sasta-ru-hinasta": "Smart homeowners don't ask how cheap &mdash; they ask how right.",
    "hidden-health-cost": "The true cost of a home is measured in time, energy and peace of mind &mdash; not just money.",
    "land-to-landmark": "A home isn't judged on completion day. It's judged years later.",
}

SERVICES_FULL = [
    ("construction", "01", "Building construction", "product-structural",
     "Bare plot to handover keys &mdash; one accountable team, one fixed price, a 10-year warranty in writing. No subcontractor blame-games. No budget surprises.",
     ["2D floor plans &amp; 3D elevations", "Structural &amp; working drawings for execution",
      "Plumbing, electrical &amp; furniture layouts", "Fe500/550 steel · RMC M20/M25 concrete",
      "Soil testing before design begins", "10-year structural warranty"],
     [("Design &amp; budgeting", "plans, materials and costing fixed before ground is broken"),
      ("Execution", "milestone-based construction with our own supervisors on site"),
      ("Finishing", "full quality review and snag resolution before handover"),
      ("Handover", "documented warranty and post-handover support")]),
    ("interiors", "02", "Interior designing", "showroom",
     "Showroom-grade interiors at a flat design fee. No percentage games, no markup surprises &mdash; just a home that feels finished.",
     ["Space planning and 3D visualisation", "Modular kitchen and wardrobe design",
      "Lighting design and electrical co-ordination", "Flat design fee &mdash; no percentage mark-ups"],
     [("Consultation", "lifestyle, budget and style preferences mapped out"),
      ("Design", "full 3D layout and material palette presented for approval"),
      ("Execution", "modular fit-out by our own execution team"),
      ("Handover", "final walkthrough and finishing touches")]),
    ("renovation", "03", "Renovation &amp; remodel", "product-additional",
     "Refresh, remodel or rebuild &mdash; planned around your life, costed to the rupee, with minimal disruption from day one.",
     ["Structural assessment before any work begins", "Kitchen and bathroom upgrades",
      "Reflooring and wall treatments", "Phased work plans to limit household disruption"],
     [("Assessment", "site survey and scope agreed in writing"),
      ("Planning", "material selection and a phased schedule"),
      ("Execution", "work carried out in agreed phases"),
      ("Sign-off", "final inspection and clean handover")]),
    ("architecture", "04", "Architecture &amp; approvals", "product-windows",
     "Designed for your site, sanctioned by us. You sign once &mdash; we handle the drawings, the approvals and every utility connection.",
     ["Site-specific architectural design", "Construction plan sanction (BDA/CDA/Panchayat/Tahasil)",
      "Temporary &amp; permanent electricity connection", "Water and sewage connection assistance"],
     [("Site study", "orientation, soil and local regulation review"),
      ("Design", "layout drawn for the site, not a generic template"),
      ("Sanction", "drawings filed and approved with local authorities"),
      ("Connections", "utility connections arranged ahead of handover")]),
]


def services_showcase():
    stage = ""
    rows = ""
    for i, (key, num, title, img, desc, inc, proc) in enumerate(SERVICES_FULL):
        stage += f'<div class="img{" active" if i == 0 else ""}" data-stage="{key}"><img class="lazy-image" src="assets/images/{img}.jpg" alt="{title}"/></div>'
        inc_html = "".join(f"<li>{x}</li>" for x in inc)
        proc_html = "".join(f"<li><b>{a}</b> &mdash; {b}</li>" for a, b in proc)
        rows += f"""
        <div class="service-row{' active' if i == 0 else ''}" data-service="{key}">
          <div class="service-row__head"><span class="service-row__num">{num}</span><h3>{title}</h3>
            <svg class="service-row__chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></div>
          <div class="service-row__body">
            <p class="service-row__desc">{desc}</p>
            <ul class="service-row__inc">{inc_html}</ul>
            <div class="service-proc"><h4>How it runs</h4><ol>{proc_html}</ol></div>
            <a class="base-button is-alpha" href="contact/">Get an estimate</a>
          </div>
        </div>"""
    return f"""
    <section class="section container" id="services" data-name="What we do">
      <div class="section-head reveal">
        <div><span class="base-title" style="margin-bottom:2rem">What we do</span><h2>One team.<br/>One bill. Zero excuses.</h2></div>
        <p class="muted lead" style="max-width:40ch">Architecture to interiors, under one roof. You relax &mdash; we build.</p>
      </div>
      <div class="services-layout reveal">
        <div class="services-stage">{stage}</div>
        <div class="services-list">{rows}</div>
      </div>
    </section>"""


def story_reader_template(d):
    quote = STORY_QUOTES[d["slug"]]
    body = f'<p class="reveal-line">{d["lede"]}</p><blockquote class="pull-quote reveal-line">&ldquo;{quote}&rdquo;</blockquote>'
    for sub, paras in d["body"]:
        body += f'<h2 class="reveal-line">{sub}</h2>' + "".join(f'<p class="reveal-line">{p}</p>' for p in paras)
    return (f'<template class="story-src">'
            f'<header class="story-reader__header"><span class="story-tag">{d["cat"]}</span>'
            f'<h1>{d["title"]}</h1><span class="story-read-time">{d["read"]}</span></header>'
            f'<div class="story-reader__hero"><img src="assets/images/{d["img"]}.jpg" alt=""/></div>'
            f'<div class="story-reader__body">{body}'
            f'<footer class="story-reader__footer"><a class="base-button is-bronze" href="contact/">Talk to us about your build {ARROW}</a></footer>'
            f'</div></template>')


def stories_section():
    cards = ""
    for d in BLOG:
        excerpt = d["lede"].split(".")[0] + "."
        cards += (f'<a class="story-card" href="blog/{d["slug"]}/" aria-label="Read: {d["title"]}">'
                  f'<div class="story-card__image"><span class="story-tag">{d["cat"]}</span>'
                  f'<img class="lazy-image" src="assets/images/{d["img"]}.jpg" alt="{d["title"]}"/></div>'
                  f'<div class="story-card__meta"><span class="story-read-time">{d["read"]}</span>'
                  f'<h3 class="story-card__title">{d["title"]}</h3><p class="story-card__excerpt">{excerpt}</p></div></a>')
    return f"""
    <section class="section container" id="stories" data-name="Stories" style="padding-bottom:8rem">
      <div class="section-head reveal" style="margin-bottom:4rem">
        <div><span class="base-title" style="margin-bottom:2rem">Stories</span><h2>Read before you<br/>break ground.</h2></div>
        <p class="muted lead" style="max-width:40ch">Hard-won lessons from real Odisha builds. The mistakes you'll be glad you skipped.</p>
      </div>
    </section>
    <div class="stories-browse reveal" data-stories-browse tabindex="0">
      <div class="stories-track">{cards}</div>
    </div>
    <div class="stories-drag-hint container" data-drag-hint><span>Drag to browse</span>
      <svg class="ar" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></div>"""


PROJECT_EXTRA = {
    "Saansud Laxmi Narayan Vihar": ("A sprawling developed-land society planned for modern family living, delivering homes that balance contemporary aspiration with timeless value.",
                                    ["End-to-end execution", "10-year warranty", "Transparent pricing"]),
    "Mahaveer Enclave": ("A premium residential enclave with contemporary planning, generous plots and a community-first layout near the city's growth corridor.",
                         ["Premium finishes", "Community design", "Modern layout"]),
    "Mahaveer Nagar": ("A thoughtfully planned society in Paradeep bringing together quality, affordability and genuine community living.",
                       ["Value for money", "Community living", "Strategic location"]),
    "IIT Bhubaneswar Project": ("A premium development near IIT Bhubaneswar, pairing academic prestige with residential excellence and strong appreciation potential.",
                                ["Premium location", "Near IIT", "High appreciation"]),
}
SPEC_LABELS = ["Area", "Units", "Avg size"]


def project_panels():
    out = ('<div class="lead-panel"><span class="base-title">Featured projects</span>'
           '<h2>Transforming land into landmarks.</h2>'
           '<span class="scroll-hint">Scroll to explore &rarr;</span></div>')
    for n, (name, loc, specs, price, img) in enumerate(PROJECTS, 1):
        vals = specs.split("|")
        sp = "".join(f'<div class="s"><span>{SPEC_LABELS[i]}</span><b>{v}</b></div>' for i, v in enumerate(vals))
        desc, tags = PROJECT_EXTRA[name]
        tag_html = "".join(f"<span>{t}</span>" for t in tags)
        out += (f'<a class="hpanel" href="contact/">'
                f'<div class="hpanel-media"><span class="num">{str(n).zfill(2)}</span><img class="lazy-image" src="assets/images/{img}.jpg" alt="{name}"/></div>'
                f'<div class="hpanel-body"><h3>{name}</h3><p class="loc">{loc}</p>'
                f'<div class="hspecs">{sp}</div><p class="hdesc">{desc}</p>'
                f'<div class="htags">{tag_html}<span>{price}</span></div>'
                f'<span class="hcta">Get details {ARROW}</span></div></a>')
    return out


home_body = f"""
  <main>
    <section class="home-header" data-name="Saansud Infra">
      <div class="background" data-parallax>
        <img class="lazy-image" src="assets/images/hero-bg.jpg" alt="A completed Saansud home at dusk" />
        <video class="hero-video" muted loop playsinline data-hero-video data-src="" aria-hidden="true"></video>
      </div>
      <div class="container">
        <div class="row">
          <p class="base-heading">Build right.<br/>Live smart.</p>
          <div class="indicator" aria-hidden="true">Scroll to explore</div>
        </div>
        <div class="row">
          <h2 class="base-title">Home builders · Odisha</h2>
          <p class="text">Your land, built into a home worth a lifetime &mdash; <span class="hl">fixed price, fixed timeline, zero surprises.</span></p>
        </div>
      </div>
    </section>

    <section class="section container" data-name="About">
      <div class="text-cta reveal">
        <span class="base-title">About Saansud</span>
        <p class="base-heading">It's the biggest thing you'll ever build. <em>We make sure it's the rightest.</em></p>
        <div class="btn-row"><a class="base-button is-black" href="about/">Our story {ARROW}</a></div>
      </div>
    </section>

    {services_showcase()}

    <section class="scale-sec" data-name="Craft">
      <div class="frame">
        <img class="lazy-image" src="assets/images/duo-1.jpg" alt="A Saansud home taking shape" />
        <div class="cap"><span class="eyebrow">Land into landmarks</span><h2>Watch a plot become a home you never want to leave.</h2></div>
      </div>
    </section>

    <section class="banner is-left" data-name="Interiors">
      <div class="media"><img class="lazy-image" src="assets/images/showroom.jpg" alt="A Saansud interior fit-out"/></div>
      <div class="inner reveal">
        <span class="eyebrow">Interior designing</span>
        <h2>Bare shell to a home you never want to leave.</h2>
        <p>Kitchens, wardrobes, lighting, finishes &mdash; handled with the same honesty as the build.</p>
        <div class="btn-row"><a class="base-button is-white" href="interior/">Explore interiors {ARROW}</a></div>
      </div>
    </section>

    {stories_section()}

    <section class="hscroll" data-name="Projects" data-count="{len(PROJECTS)}"><div class="sticky">
      <div class="hscroll-ui"><span class="t">Featured projects</span><div class="hbar"><i></i></div><span class="hcount">01 / 0{len(PROJECTS)}</span></div>
      <div class="track">{project_panels()}</div></div></section>

    <section class="section container" data-name="Craft">
      <div class="assets-duo reveal">
        <div class="figure tall"><img class="lazy-image" src="assets/images/duo-1.jpg" alt="A Saansud home taking shape"/></div>
        <div class="copy">
          <span class="base-title">The craft</span>
          <h2>Trust isn't promised in a brochure. It's poured into the foundation.</h2>
          <p class="lead">Branded steel. Tested soil. Checked at every stage. <span class="hl">Signed with a 10-year warranty.</span></p>
          <div class="btn-row"><a class="base-button is-alpha" href="construction/">How we build</a></div>
        </div>
        <div class="figure"><img class="lazy-image" src="assets/images/duo-2.jpg" alt="A finished Saansud residence"/></div>
      </div>
    </section>

    <section class="section container" data-name="Reviews">
      <div class="reviews reveal">
        <blockquote>&ldquo;They turned my dream palace into reality.&rdquo;</blockquote>
        <div class="cite"><img class="lazy-image" src="assets/images/client-avatar.jpg" alt="Prangyamayee Panda"/><span class="who">Prangyamayee Panda<span>Mancheswar, Bhubaneswar</span></span></div>
      </div>
    </section>

    <section class="banner is-center" id="contact" data-name="Contact">
      <div class="media"><img class="lazy-image" src="assets/images/footer-bg.jpg" alt="A Saansud living space at golden hour"/></div>
      <div class="inner reveal">
        <span class="eyebrow">Start your project</span>
        <h2>Your plot is waiting. So is your home.</h2>
        <div class="btn-row"><a class="base-button is-bronze" href="contact/">Get a free estimate {ARROW}</a></div>
      </div>
    </section>
  </main>"""

write("index.html", page("Saansud Infra — Build Right. Live Smart. | Home Construction in Odisha",
      "Saansud Infra builds transparent, fixed-cost homes across Odisha and Bangalore — 17.45M+ sq.ft delivered, 10-year structural warranty.",
      home_body, "Saansud Infra", "", ph="white", label="Saansud Infra"))


# ===================== ABOUT =====================
about_body = page_hero("About", "Built on trust. Backed in writing.", "We turn land into landmarks across Odisha &mdash; one accountable team, transparent costing and timelines you can hold us to.") + f"""
    <section class="section container">
      <div class="two-col">
        <div class="prose reveal">
          <p>Founded in 2024 and built on two decades of construction experience, Saansud Infra acts as your single point of accountability — overseeing architects, engineers, supervisors and quality controllers so you never have to.</p>
          <p>We are committed to excellence, transparency, quality assurance and environmentally responsible building — delivering every project on schedule, without compromising on quality or budget.</p>
        </div>
        <div class="reveal"><img class="lazy-image" src="assets/images/duo-2.jpg" alt="A completed Saansud residence" style="width:100%;aspect-ratio:3/4;object-fit:cover"/></div>
      </div>
    </section>
    <section class="scale-sec">
      <div class="frame">
        <img class="lazy-image" src="assets/images/showroom.jpg" alt="A Saansud project under way" />
        <div class="cap"><span class="eyebrow">Two decades of building</span><h2>Quietly turning Odisha's plots into landmarks &mdash; one trusted home at a time.</h2></div>
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
construction_body = page_hero("Construction", "Plot to keys. One team.", "Government sanction to final handover, delivered on time and on budget &mdash; with a 10-year warranty in writing.") + f"""
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
projects_body = page_hero("Projects", "Land into landmarks.", "Developed-land societies across Bhubaneswar, Paradeep and Jagatsinghpur. Scroll sideways to explore each one.") + f"""
    <section class="hscroll" data-count="{len(PROJECTS)}"><div class="sticky">
      <div class="hscroll-ui"><span class="t">Featured projects</span><div class="hbar"><i></i></div><span class="hcount">01 / 0{len(PROJECTS)}</span></div>
      <div class="track">{project_panels()}</div></div></section>
    <section class="banner is-center"><div class="media"><img class="lazy-image" src="assets/images/footer-bg.jpg" alt=""/></div>
      <div class="inner reveal"><span class="eyebrow">Find your plot</span><h2>Plots, finance and construction &mdash; one partner.</h2>
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
blog_body = page_hero("Blog", "Mistakes you'll be glad you skipped.", "Hard-won lessons from real Odisha builds &mdash; the stuff nobody tells you before you break ground.") + f"""
    <section class="section container"><div class="blog-grid reveal">{blog_cards()}</div></section>
  </main>"""
write("blog/index.html", page("Blog — Saansud Infra", "Construction insights and homeowner guidance from Saansud Infra.", blog_body, "Blog", "blog/"))


def story_card(d):
    return (f'<a class="blog-card reveal" href="blog/{d["slug"]}/"><div class="media"><span class="cat">{d["cat"]}</span>'
            f'<img class="lazy-image" src="assets/images/{d["img"]}.jpg" alt="{d["title"]}"/></div>'
            f'<div class="body"><h3>{d["title"]}</h3><p>{d["lede"][:130]}…</p>'
            f'<div class="meta"><span>{d["read"]}</span></div><span class="more">Read story →</span></div></a>')


for _i, _d in enumerate(BLOG):
    # each story reads as a horizontal side-scroll of panels on desktop,
    # and stacks vertically on mobile / reduced-motion (hscroll fallback).
    _panels = (f'<div class="story-panel story-panel--intro"><span class="story-tag">{_d["cat"]}</span>'
               f'<h1>{_d["title"]}</h1><p class="story-lede">{_d["lede"]}</p>'
               f'<span class="story-read-time">{_d["read"]}</span></div>'
               f'<div class="story-panel story-panel--media"><img class="lazy-image" src="assets/images/{_d["img"]}.jpg" alt="{_d["title"]}"/></div>')
    for _sub, _paras in _d["body"]:
        _panels += (f'<div class="story-panel"><h2 class="story-h">{_sub}</h2>'
                    + "".join(f'<p>{_p}</p>' for _p in _paras) + '</div>')
    _panels += (f'<div class="story-panel story-panel--quote"><blockquote class="pull-quote">&ldquo;{STORY_QUOTES[_d["slug"]]}&rdquo;</blockquote></div>'
                f'<div class="story-panel story-panel--cta"><span class="eyebrow">Build with us</span>'
                f'<h2 class="story-h">Talk to us about your build.</h2>'
                f'<div class="btn-row" style="margin-top:1rem"><a class="base-button is-bronze" href="contact/">Get a free estimate {ARROW}</a>'
                f'<a class="base-button is-alpha" href="blog/">All stories</a></div></div>')
    _count = 2 + len(_d["body"]) + 2
    _story = f"""
  <main>
    <section class="hscroll story-hscroll" data-name="{_d['cat']}" data-count="{_count}"><div class="sticky">
      <div class="hscroll-ui"><span class="t">{_d['cat']} · {_d['read']}</span><div class="hbar"><i></i></div><span class="hcount">01 / {str(_count).zfill(2)}</span></div>
      <div class="track">{_panels}</div>
    </div></section>
  </main>"""
    write(f"blog/{_d['slug']}/index.html",
          page(f"{_d['title']} — Saansud Infra", _d['lede'][:155], _story, _d['cat'], "blog/"))


# ===================== CONTACT =====================
contact_body = page_hero("Contact", "Get a free estimate.", "Tell us about your plot. We reply within two working days &mdash; with real numbers, not a sales pitch.") + f"""
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
