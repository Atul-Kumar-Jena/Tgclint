# Fluid Glass

An editorial-luxury marketing site for a high-end architectural glazing studio — a
faithful recreation of the [fluid.glass](https://fluid.glass) design language
(floating glass nav pill, centred menu overlay, slide-in quote panel, masked text
reveals, scroll-scrubbed parallax media, and a line-art → fill pavilion reveal).

It is built as a **fully self-contained static site** — no runtime dependencies,
no external images, no CDN libraries — so it renders identically offline and can
never show a broken asset.

## How it's built

A tiny zero-dependency static-site generator (`build.mjs`, Node stdlib only)
assembles `src/` into `dist/`:

- **Content** lives in `src/data/site.json` (CMS-like: nav, products, projects,
  testimonials, services, news).
- **Components** are HTML partials in `src/partials/` (head, footer, nav pill,
  menu, quote panel, cookie bar) injected via `{{> name }}`.
- **Pages** in `src/pages/` use `{{ vars }}` and `<!-- @TOKENS -->` for
  data-driven fragments (cards, testimonials, services…). Project detail pages are
  generated per-slug from a `_project.html` template.
- **Art direction** is generated SVG ("scenes": glazed houses, interiors,
  blueprints, the line-art pavilion) plus a 2D-canvas "fluid glass" hero.
- CSS (`src/styles/*`) and JS (`src/scripts/*`) are concatenated into
  `dist/app.css` and `dist/app.js`.

### Motion engine (`src/scripts/`)

Hand-rolled, framework-free equivalents of the Exo-Ape stack:

- `smooth-scroll.js` — Lenis-style inertial wheel scrolling on the native
  scrollbar (native fallback on touch / reduced-motion).
- `motion.js` — IntersectionObserver reveals + per-frame parallax & scrub.
- `split.js` — masked line reveals. `hero.js` — canvas caustics. `stories.js` —
  scrubbed testimonial carousel. Plus loader, menu, quote, cursor, cookie.
- A single `requestAnimationFrame` loop drives everything (`core.js`).

Everything animates only `transform` / `opacity` / `clip-path`, and respects
`prefers-reduced-motion`.

## Commands

```bash
node build.mjs        # build -> dist/
node tools/smoke.mjs  # verify no broken links and that JS hooks exist
npm run serve         # build + serve dist/ on http://localhost:8080
```

## Deployment

Pushing to the working branch (or `main`) triggers
`.github/workflows/deploy.yml`, which builds, smoke-tests, and publishes `dist/`
to **GitHub Pages**. The workflow self-enables Pages
(`actions/configure-pages` with `enablement: true`).

Live URL: <https://atul-kumar-jena.github.io/Tgclint/>

> If the first deploy is blocked by environment protection (Pages can be
> restricted to the default branch), enable it once under
> **Settings → Pages → Build and deployment → Source: GitHub Actions**, or merge
> the branch into `main`.
