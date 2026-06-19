# Design System — Reference Kit

A small, framework-agnostic foundation for an editorial / "fluid glass" style:
colour tokens, a regular-weight type scale, easing curves, a fluid viewport-sizing
unit, glass-morphism, and a few generic components. Use it as a starting point and
build your **own** layouts on top — it's a kit, not a site.

## Files
| File | What's in it |
|------|--------------|
| `tokens.css` | CSS variables: palette, fonts, `--font-s` fluid sizing, easings, spacing scale, glass + border vars |
| `base.css` | reset + typography (h1–h3 at weight 400, body, mono `.label` / `.caption`) |
| `components.css` | `.section-title` (diamond marker), `.btn` (solid / glass / text), `.glass` panel, animated `.link`, `.line-mask` reveal, `.container` + 24/6-col `.grid`, theme helpers |
| `index.html` | a neutral demo wiring the pieces together |

## Use
```html
<link rel="stylesheet" href="tokens.css">
<link rel="stylesheet" href="base.css">
<link rel="stylesheet" href="components.css">
```

## Notes
- **Fonts:** the look pairs a neutral grotesque with a mono. The original reference
  uses the licensed **Aeonik Pro/Mono** — license it (fontshare.com) or substitute
  e.g. Hanken/Schibsted Grotesk + Geist/JetBrains Mono. Set them in `--font-sans` /
  `--font-mono`.
- **Fluid sizing:** `tokens.css` sets `html { font-size: var(--font-s) }` so every
  `rem` scales with the viewport (1rem ≈ 10px at the reference width). All sizes in
  `base.css` / `components.css` are expressed in `rem` to ride along.
- **Reveals:** `.line-mask` is class-driven — add `is-in` (via an IntersectionObserver
  in a real project) to play. `prefers-reduced-motion` is respected.
- **Glass:** needs `backdrop-filter`; a solid fallback is included via `@supports`.
