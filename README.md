# Fluid Glass

A faithful, multi-page clone of **fluid.glass** (Exo Ape) for the Fluid Glass
brand — UK specialists in structural & architectural glazing.

Zero-build static site. Pages are generated from one shared shell by `build.py`.

## Develop

```bash
python3 build.py                              # regenerate all HTML
# serve at the project path so <base href="/Tgclint/"> resolves:
python3 -m http.server 8300 --directory ..    # then open http://localhost:8300/Tgclint/
```

Edit content/structure in **`build.py`** (not the generated `*.html`), then re-run it.

## Pages
`/` home · `/about/` · `/collection/` · `/projects/` · `/approach/` ·
`/showroom/` · `/news/` · `/contact/` · `/privacy-policy/` · `/terms-conditions/` · `404.html`

## Structure
```
build.py                 Static generator (shared header/menu/footer + per-page content)
index.html, */index.html Generated pages
assets/css/design-system.css  Design tokens + base components (Aeonik, colours)
assets/css/site.css      Layout: capsule nav, menu overlay, intro, cursor, pages
assets/js/main.js        Intro splash, cursor, cookies, menu, Lenis, modal, reveals
assets/images/           Photography
```

## Design system (fluid.glass spec)
- **Colours** cream `#f3f0ec`, black `#0b1012`, grey `#212325`, taupe `#d4cec6`
- **Type** Aeonik Pro → Satoshi, Aeonik Mono → JetBrains Mono (free Fontshare look-alikes);
  fluid `--font-s = (100vw/--size)*10`, `--size` 1600 / 1100 (tablet) / 375
- **Nav** dark frosted-glass capsule pinned bottom-centre (logo · section title · burger)
  that opens a slide-up menu overlay
- **Extras** intro 3D-cube splash (once/session), custom cursor, cookie banner — all
  respect `prefers-reduced-motion` / touch

## Notes
- `<base href="/Tgclint/">` — change to `/` if moved to a root domain.
- Real Aeonik & the source videos aren't included; free font look-alikes and the
  supplied stills are used. Drop real `.mp4`s into `assets/` to wire up `<video>`.
