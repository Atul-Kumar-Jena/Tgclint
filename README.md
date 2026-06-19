# Fluid Glass

Marketing site for **Fluid Glass** — UK specialists in structural &
architectural glazing.

A zero-build static site: open `index.html` directly, or serve the folder.

## Run locally

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Structure

```
index.html              Home page
404.html                Not-found page
assets/
  css/design-system.css Design tokens, fluid type scale, base components
  css/site.css          Page layout + responsive rules
  js/main.js            Smooth scroll, lazy images, reveal-on-scroll, nav
  images/               Photography
```

## Design system

- **Colours** — cream `#f3f0ec`, black `#0b1012`, grey `#212325`, taupe `#d4cec6`
- **Type** — Aeonik Pro (→ Satoshi) for display, Aeonik Mono (→ JetBrains Mono) for labels
- **Scale** — fluid: `html` font-size is viewport-relative, so all `rem` values scale with the screen
- **Motion** — Lenis smooth scroll, IntersectionObserver reveals; all respect `prefers-reduced-motion`
