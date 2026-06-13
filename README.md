# Saansud Infra — Fluid Glass experience

The Saansud Infra site rebuilt in the fluid.glass design language — floating glass
dock, first-load curtain, stacked-card page transitions, pinned horizontal project
narratives, masked text reveals and inertial smooth scrolling — carrying the real
Saansud brand (orange `#F1530E` / deep ink navy from the brand book) and the real
Saansud content: projects, services, leadership, testimonials, insights articles and
contact details.

## Stack

- **Nuxt 3 + Vue 3** (`ssr: true`, statically generated for GitHub Pages)
- **GSAP + ScrollTrigger** for all scroll choreography
- **Lenis** for inertial smooth scrolling (bridged on the GSAP ticker)

```bash
npm install
npm run dev        # local dev server
npm run generate   # static build -> .output/public
```

## Experience architecture

- `app.vue` — first-load curtain and the stacked-card page transition: the old page
  dims in place while the new page slides up over it as a rounded card; scroll reset
  happens under full cover so it is never visible.
- `components/Dock.vue` — the floating glass dock: pill → unfolding menu, with an
  end-of-page auto-unfold. Scrollable drawer body opts out of Lenis
  (`data-lenis-prevent`).
- `components/QuotePanel.vue` — slide-in "Get a quote" panel. The panel owns its
  wheel input (`data-lenis-prevent`) and halts the page behind the scrim while open.
- `composables/usePageMotion.ts` — per-page GSAP context: masked line splits, reveals,
  parallax media, the sketch→render pavilion scrub, sheet-recede section layering, and
  the pinned horizontal project narrative (velocity lean, per-panel unfold from the
  right, in-frame media drift, live counter + hairline progress).
- `assets/css/tokens.css` — the Saansud design tokens (palette, glass recipes, type
  scale, motion grammar).

All motion is transform/opacity/clip-path only and respects
`prefers-reduced-motion`.

## Deployment

Pushing to the working branch (or `main`) triggers
`.github/workflows/deploy.yml`, which runs `nuxt generate` on a GitHub runner and
force-publishes `.output/public` to the **gh-pages** branch (the repo's Pages
source).

Live URL: <https://atul-kumar-jena.github.io/Tgclint/>
