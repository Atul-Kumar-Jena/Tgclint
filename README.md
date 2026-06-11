# Saansud Infra — Fluid Glass Rebuild

Complete rebuild of [saansud.com](https://saansud.com) as a premium, Fluid-Glass-inspired
static site. Every section, project, testimonial, leadership profile, award, media
mention, blog article and contact detail from the original site is preserved — the
execution layer (design system, motion, responsiveness) is rebuilt to a world-class
standard.

## Stack

Pure static HTML + CSS + JS. No build step, no framework. Open `index.html` or serve
the folder with any static server:

```bash
python3 -m http.server 8000
```

## Pages

| Page | File |
|---|---|
| Homepage (hero rotator, stats, about, why-us stack, projects, interiors rail, testimonials, leadership, brand summary donut, awards, media, blog, CTA) | `index.html` |
| About (who we are, stats, why us, management, recognitions, media) | `about.html` |
| Building Constructions (Saansud Shift stack, self-build comparison, process, packages) | `construction.html` |
| Interior Solutions hub | `interior-solutions.html` |
| Interior service pages | `space-planning.html`, `interior-designing.html`, `home-decoration.html`, `total-furnishing.html`, `exterior-designing.html` |
| Apartments / Projects (cards, brand summary, testimonials) | `projects.html` |
| Blogs list | `blog.html` |
| Blog articles (full original content) | `blog-single.html`, `blog-smart-planning.html`, `blog-turnkey-confidence.html` |
| Contact (CEO's message, form, join the conversation) | `contact.html` |
| Careers | `careers.html` |
| Legal | `privacy.html`, `terms.html`, `disclaimer.html` |

## Design system (`assets/css/main.css`)

- **Brand tokens** from the Saansud brand book: Saansud orange `#F1530E` (print
  `#ED4801`), deep brand ink `#0B102C`, royal navy `#1C2B60`, porcelain/stone neutrals.
- **Glass primitives** (`.glass`, `.glass-d`) — frosted backdrop blur, inner highlights,
  layered shadow hierarchy, sheen sweep on hover.
- **Typography**: Space Grotesk (display) + Inter (body) + Fraunces (italic accents).
- Mobile-first; fluid type/spacing via `clamp()`.

## Interaction engine (`assets/js/main.js`)

- **Inertial smooth scroll** — Lenis-style wheel smoothing that eases the real document
  scroll position every frame (fine pointers only), so sticky pinning, observers and
  anchors all keep working while the page glides.
- **First-load curtain** — the Saansud mark animates in on an ink veil and hands over
  into a staggered hero rise (once per session).
- **Stack cards** — genuine physical stacking via `position: sticky` in natural DOM
  order (no z-index management). Pinned cards recede into the pile: top-origin scale,
  lift, rotateX tip and an ink veil, computed in a single rAF pass. Compositor-only:
  no flicker, no clipping, no layout jumps.
- **Dropdown glass panels** — Services / Company / Insights navigation with
  hover-intent, keyboard and touch support; grouped discovery sheet on mobile.
- **Image loading** — branded shimmer placeholders on every media container until the
  photo decodes; hero atmospheres fetch at high priority; zero blank boxes or pop-in.
- **Fluid rails** — horizontal scroll-snap galleries that "unfold" with seeded
  per-card perspective/scale/drift; spotlight-carousel tuning on phones; drag-to-scroll
  on desktop; arrows + progress bar.
- **Image unveil** — every photo container gets a seeded directional clip-path wipe and
  settle-scale, so each image uncovers with its own character.
- Hero rotator, animated counters, donut chart, share (Web Share API + clipboard
  fallback), mail-handoff contact form, reveal-on-scroll. All effects respect
  `prefers-reduced-motion`; content is fully visible without JavaScript.

## Assets

`assets/img/**` — imagery recovered at maximum available resolution from the brand
reference (`docs/reference/`): logo (alpha-extracted), leadership portraits, project
photography, interior galleries, blog imagery, award trophies, media-platform marks,
ambient atmosphere strips.
