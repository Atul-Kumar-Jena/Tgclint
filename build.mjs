/* Fluid Glass — static site generator
 * Assembles src/ into dist/: partials, per-page context, data-driven cards,
 * generated SVG "scenes", and concatenated app.css / app.js.
 * Zero runtime/build dependencies (Node stdlib only) so it is bullet-proof in CI.
 */
import {
  readFileSync, writeFileSync, mkdirSync, readdirSync, statSync,
  copyFileSync, rmSync, existsSync
} from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = join(__dirname, 'src');
const DIST = join(__dirname, 'dist');
const site = JSON.parse(readFileSync(join(SRC, 'data', 'site.json'), 'utf8'));

/* ---------------------------------------------------------------- helpers */
const read = (p) => readFileSync(p, 'utf8');
const partial = (name) => read(join(SRC, 'partials', `${name}.html`));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function copyDir(from, to) {
  mkdirSync(to, { recursive: true });
  for (const e of readdirSync(from)) {
    const f = join(from, e), t = join(to, e);
    if (statSync(f).isDirectory()) copyDir(f, t);
    else copyFileSync(f, t);
  }
}
function concat(dir, order) {
  return order.map((f) => `/* ===== ${f} ===== */\n${read(join(SRC, dir, f))}`).join('\n\n');
}

/* ---------------------------------------------------------------- scenes  */
/* Self-contained SVG art direction: stylised architectural glazing scenes.
 * No external images -> nothing can 404. Each call gets unique gradient ids. */
let UID = 0;
const PAL = {
  barn:    { sky: ['#c9d2cb', '#a7b2a6', '#86927f'], ground: '#76856b', wall: '#26282455', glass: '#e7efe9', glassEdge: '#1d1f1c', sun: '#f3efe4', sunX: 660, sea: false },
  cottage: { sky: ['#dde6ef', '#c4d2e0', '#a7b7c9'], ground: '#9aa886', wall: '#8a5a4455', glass: '#eef4f0', glassEdge: '#5e3b2c', sun: '#fff5e6', sunX: 180, sea: false },
  coast:   { sky: ['#d6e9f1', '#bfe1ea', '#a9d3df'], ground: '#5f93a0', wall: '#e6e4dd55', glass: '#e3f1f5', glassEdge: '#2b3a40', sun: '#fffaf0', sunX: 620, sea: true },
  moor:    { sky: ['#c0b9c6', '#9c95a8', '#766f86'], ground: '#6c675f', wall: '#7c4a3255', glass: '#dadfe4', glassEdge: '#3a2a20', sun: '#efe6df', sunX: 200, sea: false },
  dusk:    { sky: ['#f0d9c2', '#d7a98f', '#8c6f86'], ground: '#5b5560', wall: '#2a262e55', glass: '#f3e4d6', glassEdge: '#241f29', sun: '#ffe9cf', sunX: 600, sea: false },
  day:     { sky: ['#dfeaf2', '#cadbe9', '#b6ccdd'], ground: '#93a98e', wall: '#deded6aa', glass: '#e8f2f4', glassEdge: '#33414a', sun: '#fffdf6', sunX: 560, sea: false }
};

function house(palKey = 'day', { ratio = '4 / 3' } = {}) {
  const p = PAL[palKey] || PAL.day;
  const u = `h${UID++}`;
  const ground = p.sea
    ? `<rect x="0" y="430" width="800" height="170" fill="${p.ground}"/>
       <g opacity=".5" stroke="#ffffff" stroke-width="1">
         <line x1="0" y1="470" x2="800" y2="470"/><line x1="0" y1="505" x2="800" y2="505"/><line x1="0" y1="545" x2="800" y2="545"/></g>`
    : `<path d="M0 430 Q 400 405 800 432 L800 600 L0 600 Z" fill="${p.ground}"/>`;
  return `<svg class="scene" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true" style="aspect-ratio:${ratio}">
    <defs>
      <linearGradient id="sky${u}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${p.sky[0]}"/><stop offset=".55" stop-color="${p.sky[1]}"/><stop offset="1" stop-color="${p.sky[2]}"/>
      </linearGradient>
      <radialGradient id="sun${u}" cx="${p.sunX / 800}" cy=".28" r=".5">
        <stop offset="0" stop-color="${p.sun}" stop-opacity=".95"/><stop offset="1" stop-color="${p.sun}" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="glass${u}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${p.glass}" stop-opacity=".95"/><stop offset=".5" stop-color="${p.glass}" stop-opacity=".55"/><stop offset="1" stop-color="${p.glass}" stop-opacity=".85"/>
      </linearGradient>
    </defs>
    <rect width="800" height="600" fill="url(#sky${u})"/>
    <circle cx="${p.sunX}" cy="150" r="240" fill="url(#sun${u})"/>
    <path d="M0 360 Q 220 300 430 350 T 800 340 L800 460 L0 460 Z" fill="#000" opacity=".06"/>
    ${ground}
    <g>
      <path d="M250 430 L250 250 L470 250 L470 430 Z" fill="${p.wall}"/>
      <path d="M235 252 L360 175 L485 252 Z" fill="${p.glassEdge}" opacity=".9"/>
      <rect x="270" y="280" width="180" height="150" fill="url(#glass${u})" stroke="${p.glassEdge}" stroke-width="3"/>
      <g stroke="${p.glassEdge}" stroke-width="2" opacity=".7">
        <line x1="330" y1="280" x2="330" y2="430"/><line x1="390" y1="280" x2="390" y2="430"/><line x1="270" y1="355" x2="450" y2="355"/>
      </g>
      <path d="M285 290 L330 290 L300 430 L285 430 Z" fill="#ffffff" opacity=".25"/>
      <path d="M470 360 L600 360 L600 430 L470 430 Z" fill="${p.glassEdge}" opacity=".18"/>
      <rect x="490" y="372" width="100" height="58" fill="url(#glass${u})" stroke="${p.glassEdge}" stroke-width="2"/>
    </g>
  </svg>`;
}

function interior(palKey = 'day') {
  const p = PAL[palKey] || PAL.day;
  const u = `i${UID++}`;
  return `<svg class="scene" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true">
    <defs>
      <linearGradient id="ig${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.sky[0]}"/><stop offset="1" stop-color="${p.sky[2]}"/></linearGradient>
      <linearGradient id="if${u}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".3"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
    </defs>
    <rect width="800" height="600" fill="#1b1c1e"/>
    <rect x="120" y="70" width="560" height="430" fill="url(#ig${u})"/>
    <g stroke="#0e0f10" stroke-width="10"><rect x="120" y="70" width="560" height="430" fill="none"/><line x1="307" y1="70" x2="307" y2="500"/><line x1="493" y1="70" x2="493" y2="500"/></g>
    <path d="M140 90 L260 90 L180 480 L140 480 Z" fill="url(#if${u})"/>
    <rect x="0" y="500" width="800" height="100" fill="#141517"/>
    <rect x="90" y="430" width="150" height="70" fill="#26282b"/>
  </svg>`;
}

function detail(palKey = 'day') {
  const p = PAL[palKey] || PAL.day;
  const u = `d${UID++}`;
  return `<svg class="scene" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true">
    <defs><linearGradient id="dg${u}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${p.sky[1]}"/><stop offset="1" stop-color="${p.glassEdge}"/></linearGradient></defs>
    <rect width="800" height="600" fill="url(#dg${u})"/>
    <g stroke="#0c0d0e" stroke-width="14" fill="none"><path d="M-20 180 L520 -20"/><path d="M120 620 L640 120"/></g>
    <g stroke="#ffffff" stroke-width="2" opacity=".5"><path d="M-20 210 L520 10"/><path d="M150 640 L660 150"/></g>
    <circle cx="560" cy="240" r="46" fill="#0c0d0e"/><circle cx="560" cy="240" r="20" fill="#2c2e31"/>
    <path d="M520 360 L820 220 L820 600 L380 600 Z" fill="#000" opacity=".25"/>
  </svg>`;
}

function blueprint() {
  const u = `b${UID++}`;
  return `<svg class="scene" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true">
    <defs>
      <pattern id="grid${u}" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0 L0 0 0 40" fill="none" stroke="#3a4658" stroke-width="1"/></pattern>
      <linearGradient id="bb${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#10151d"/><stop offset="1" stop-color="#1a2230"/></linearGradient>
    </defs>
    <rect width="800" height="600" fill="url(#bb${u})"/>
    <rect width="800" height="600" fill="url(#grid${u})"/>
    <g stroke="#9fb4cf" stroke-width="2" fill="none" opacity=".9">
      <rect x="180" y="150" width="300" height="220"/><rect x="480" y="150" width="160" height="220"/>
      <line x1="180" y1="260" x2="640" y2="260"/><line x1="330" y1="150" x2="330" y2="370"/>
      <path d="M180 370 L180 420 L640 420 L640 370"/><circle cx="330" cy="260" r="46" stroke-dasharray="5 5"/>
    </g>
    <g stroke="#cfe0f5" stroke-width="1.4" opacity=".8"><line x1="180" y1="120" x2="640" y2="120"/><path d="M180 112 l8 8 l-8 8"/><path d="M640 112 l-8 8 l8 8"/></g>
  </svg>`;
}

function product(key) {
  const map = {
    doors:      { bg: ['#e7efe9', '#cdd9d2'], edge: '#23302b', sheen: '#ffffff' },
    windows:    { bg: ['#e3edf3', '#c6d6e2'], edge: '#26313a', sheen: '#ffffff' },
    additional: { bg: ['#f0ece2', '#dcd3c2'], edge: '#3a3326', sheen: '#fff7e9' },
    structural: { bg: ['#e9e9ec', '#cfd0d6'], edge: '#2c2d33', sheen: '#ffffff' }
  };
  const p = map[key] || map.doors;
  const u = `p${UID++}`;
  let art = '';
  if (key === 'doors') art = `<g stroke="${p.edge}" stroke-width="4"><rect x="180" y="150" width="220" height="320" fill="none"/><rect x="400" y="150" width="220" height="320" fill="none"/><line x1="290" y1="150" x2="290" y2="470"/><line x1="510" y1="150" x2="510" y2="470"/></g><path d="M210 175 L260 175 L230 450 L210 450 Z" fill="${p.sheen}" opacity=".5"/>`;
  else if (key === 'windows') art = `<g stroke="${p.edge}" stroke-width="4" fill="none"><rect x="220" y="160" width="360" height="300"/><line x1="400" y1="160" x2="400" y2="460"/><line x1="220" y1="310" x2="580" y2="310"/></g><path d="M250 185 L300 185 L270 290 L250 290 Z" fill="${p.sheen}" opacity=".5"/>`;
  else if (key === 'additional') art = `<g stroke="${p.edge}" stroke-width="4" fill="none"><path d="M210 430 L300 200 L500 200 L590 430 Z"/><line x1="300" y1="200" x2="350" y2="430"/><line x1="500" y1="200" x2="450" y2="430"/><line x1="328" y1="315" x2="472" y2="315"/></g><path d="M320 215 L360 215 L335 300 L318 300 Z" fill="${p.sheen}" opacity=".5"/>`;
  else art = `<g stroke="${p.edge}" stroke-width="4" fill="none"><rect x="170" y="170" width="460" height="280"/><line x1="400" y1="170" x2="400" y2="450"/></g><path d="M200 195 L260 195 L210 430 L200 430 Z" fill="${p.sheen}" opacity=".45"/><circle cx="400" cy="310" r="7" fill="${p.edge}"/>`;
  return `<svg class="scene" viewBox="0 0 800 620" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true">
    <defs><linearGradient id="pg${u}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${p.bg[0]}"/><stop offset="1" stop-color="${p.bg[1]}"/></linearGradient></defs>
    <rect width="800" height="620" fill="url(#pg${u})"/>${art}
  </svg>`;
}

/* Line-art glass pavilion used in the closing reveal (line + fill share geometry) */
function pavilionGeometry() {
  return `
    <path class="pv-roof" d="M120 250 L400 175 L1080 250 L1080 295 L120 295 Z"/>
    <path class="pv-floor" d="M120 560 L1080 560 L1080 600 L120 600 Z"/>
    <g class="pv-frame">
      <rect x="150" y="295" width="820" height="265"/>
      <line x1="370" y1="295" x2="370" y2="560"/><line x1="560" y1="295" x2="560" y2="560"/><line x1="760" y1="295" x2="760" y2="560"/>
      <rect x="970" y="295" width="110" height="265"/>
    </g>
    <g class="pv-detail">
      <path d="M205 545 q12 -40 0 -78 q-14 -30 6 -52"/>
      <circle cx="300" cy="500" r="18"/><rect x="430" y="470" width="70" height="70"/>
      <path d="M620 540 q20 -60 70 -70 q-40 30 -30 70"/>
      <path d="M1010 545 q10 -50 -6 -90 q18 20 36 8"/>
    </g>
    <g class="pv-foliage">
      <path d="M120 250 q60 -70 130 -64 q-30 -50 50 -70 q40 -40 110 -10 q60 -40 120 -2 q70 -34 140 4 q60 -30 120 6 q60 -16 80 30"/>
    </g>`;
}
function pavilion() {
  return `<svg class="pavilion" viewBox="0 0 1200 640" preserveAspectRatio="xMidYMax meet" role="img" aria-label="Line drawing of a glass pavilion">
    <defs>
      <linearGradient id="pvsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d7e6ea"/><stop offset="1" stop-color="#eef0ec"/></linearGradient>
      <linearGradient id="pvglass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#cfe2e0"/><stop offset=".5" stop-color="#b6cfca"/><stop offset="1" stop-color="#d8e7e2"/></linearGradient>
      <clipPath id="pvclip"><rect x="0" y="0" width="1200" height="640"/></clipPath>
    </defs>
    <g class="pavilion__fill" clip-path="url(#pvclip)">
      <rect x="120" y="175" width="960" height="425" fill="url(#pvsky)"/>
      <rect x="150" y="295" width="820" height="265" fill="url(#pvglass)"/>
      <rect x="970" y="295" width="110" height="265" fill="#c9c2b4"/>
      <path d="M120 250 L400 175 L1080 250 L1080 295 L120 295 Z" fill="#dfe3df"/>
      <path d="M120 560 L1080 560 L1080 600 L120 600 Z" fill="#cdbfa8"/>
    </g>
    <g class="pavilion__line">${pavilionGeometry()}</g>
  </svg>`;
}

/* ---------------------------------------------------------------- fragments */
const a = (href, base) => /^https?:|^mailto:|^tel:|^#/.test(href) ? href : base + href;

function navLinksBig(base, active) {
  return site.nav.map((n, i) =>
    `<a class="menu__link" href="${a(n.href, base)}"${n.key === active ? ' aria-current="page"' : ''} style="--i:${i}"><span>${esc(n.label)}</span></a>`
  ).join('\n');
}
function navLinksSecondary(base, active) {
  return site.navSecondary.map((n) =>
    `<a class="menu__sub" href="${a(n.href, base)}"${n.key === active ? ' aria-current="page"' : ''}>${esc(n.label)}</a>`
  ).join('\n');
}
function footerNav(base, active) {
  return [...site.nav, ...site.navSecondary].map((n) =>
    `<li><a href="${a(n.href, base)}"${n.key === active ? ' aria-current="page"' : ''}>${esc(n.label)}</a></li>`
  ).join('');
}
function socialLinks() {
  return site.socials.map((s) =>
    `<a href="${s.href}" target="_blank" rel="noopener" aria-label="${esc(s.label)}"><span aria-hidden="true">${esc(s.short)}</span></a>`
  ).join('');
}
function button(label, href, base, { variant = 'dark', arrow = true } = {}) {
  return `<a class="btn btn--${variant}" href="${a(href, base)}" data-hover>
    ${arrow ? '<span class="btn__icon" aria-hidden="true">&#8618;</span>' : ''}
    <span class="btn__labels"><span class="btn__label">${esc(label)}</span><span class="btn__label" aria-hidden="true">${esc(label)}</span></span>
  </a>`;
}
function quoteButton(label, base, { variant = 'dark' } = {}) {
  return `<button class="btn btn--${variant}" type="button" data-quote-open data-hover>
    <span class="btn__icon" aria-hidden="true">&#8618;</span>
    <span class="btn__labels"><span class="btn__label">${esc(label)}</span><span class="btn__label" aria-hidden="true">${esc(label)}</span></span>
  </button>`;
}
function productCards(base) {
  return site.products.map((p, i) => `
    <a class="card card--product reveal" href="${a('collection.html#' + p.key, base)}" data-hover style="--i:${i}">
      <div class="card__media" data-parallax-wrap><div data-parallax>${product(p.tint)}</div></div>
      <div class="card__row"><h3 class="card__title">${esc(p.name)}</h3><span class="card__index">0${i + 1}</span></div>
      <p class="card__summary">${esc(p.summary)}</p>
    </a>`).join('\n');
}
function projectCards(base, limit) {
  const list = limit ? site.projects.slice(0, limit) : site.projects;
  return list.map((p, i) => `
    <a class="card card--project reveal" href="${a('projects/' + p.slug + '.html', base)}" data-hover style="--i:${i}">
      <div class="card__media card__media--tall" data-parallax-wrap><div data-parallax>${house(p.scene)}</div>
        <span class="card__cursor" aria-hidden="true">View project</span></div>
      <div class="card__row"><h3 class="card__title">${esc(p.name)}</h3><span class="card__index">${esc(p.year)}</span></div>
      <div class="card__tags">${p.tags.map((t) => `<span>${esc(t)}</span>`).join('')}</div>
    </a>`).join('\n');
}
const PRODUCT_POINTS = {
  doors: ['Slim 20mm sightlines', 'Panels up to 3m tall', 'Flush thresholds', 'Triple-glazed options'],
  windows: ['Steel-look profiles', 'Concealed fixings', 'Acoustic glazing', 'Heritage-approved'],
  additional: ['Structural rooflights', 'Walk-on options', 'Ventilated lanterns', 'Self-cleaning glass'],
  structural: ['Frameless walls', 'Glass balustrades', 'Walk-on floors', 'Invisible silicone joints']
};
function productSections() {
  return site.products.map((p, i) => `
    <div class="product-section" id="${p.key}">
      <div class="product-section__media reveal" data-parallax-wrap><div data-parallax>${product(p.tint)}</div></div>
      <div class="product-section__text">
        <p class="product-section__num">0${i + 1} — Collection</p>
        <h2 class="product-section__title" data-split>${esc(p.name)}</h2>
        <p class="product-section__copy reveal">${esc(p.summary)}</p>
        <ul class="svc__points" style="margin-top:1.5rem">${(PRODUCT_POINTS[p.tint] || []).map((pt) => `<li>${esc(pt)}</li>`).join('')}</ul>
      </div>
    </div>`).join('\n');
}
function testimonialSlides() {
  return site.testimonials.map((t, i) => `
    <figure class="story" data-story="${i}">
      <blockquote class="story__quote">${esc(t.quote)}</blockquote>
      <figcaption class="story__by">
        <span class="story__avatar" aria-hidden="true">${esc(t.initials)}</span>
        <span class="story__meta"><span class="story__name">${esc(t.name)}</span><span class="story__role">${esc(t.role)}</span></span>
      </figcaption>
    </figure>`).join('\n');
}
function newsList(base) {
  return site.news.map((n, i) => {
    const d = new Date(n.date + 'T00:00:00');
    const date = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    return `<a class="news-item reveal" href="${a('news.html#' + n.slug, base)}" data-hover style="--i:${i}">
      <span class="news-item__cat">${esc(n.category)}</span>
      <h3 class="news-item__title">${esc(n.title)}</h3>
      <p class="news-item__excerpt">${esc(n.excerpt)}</p>
      <time class="news-item__date" datetime="${n.date}">${date}</time>
    </a>`;
  }).join('\n');
}
function servicesList() {
  return site.services.map((s, i) => `
    <div class="svc reveal" style="--i:${i}">
      <h3 class="svc__title">${esc(s.title)}</h3>
      <div class="svc__body"><p>${esc(s.body)}</p>
        <ul class="svc__points">${s.points.map((pt) => `<li>${esc(pt)}</li>`).join('')}</ul>
      </div>
    </div>`).join('\n');
}
function approachSteps(base) {
  const sceneFor = { studio: () => interior('day'), engineering: () => blueprint(), install: () => detail('dusk') };
  return site.approachSteps.map((s) => `
    <section class="step" data-theme="dark">
      <div class="step__media reveal">
        <div class="step__card step__card--a" data-parallax-wrap><div data-parallax>${sceneFor[s.scene]()}</div></div>
        <div class="step__card step__card--b" data-parallax-wrap><div data-parallax>${detail('day')}</div></div>
      </div>
      <div class="step__text">
        <p class="eyebrow">${esc(s.index)}. ${esc(s.label)}</p>
        <h2 class="step__title reveal" data-split>${s.title.map((l) => esc(l)).join('<br>')}</h2>
        <p class="step__copy reveal">${esc(s.body)}</p>
      </div>
    </section>`).join('\n');
}

/* ---------------------------------------------------------------- pages    */
const PAGES = {
  'index.html':      { active: '',           navLabel: 'Home',       title: site.brand + ' — ' + site.tagline, theme: 'dark', bodyClass: 'has-loader' },
  'about.html':      { active: 'about',       navLabel: 'About',      title: 'About — ' + site.brand, theme: 'light' },
  'collection.html': { active: 'collection',  navLabel: 'Collection', title: 'Collection — ' + site.brand, theme: 'light' },
  'projects.html':   { active: 'projects',    navLabel: 'Projects',   title: 'Projects — ' + site.brand, theme: 'light' },
  'approach.html':   { active: 'approach',    navLabel: 'Approach',   title: 'Approach — ' + site.brand, theme: 'dark' },
  'contact.html':    { active: 'contact',     navLabel: 'Contact',    title: 'Contact — ' + site.brand, theme: 'light' },
  'news.html':       { active: 'news',        navLabel: 'News',       title: 'News — ' + site.brand, theme: 'light' },
  'showroom.html':   { active: 'showroom',    navLabel: 'Showroom',   title: 'Showroom — ' + site.brand, theme: 'dark' }
};

function context(base, meta) {
  return {
    base,
    brand: site.brand,
    tagline: esc(site.tagline),
    description: esc(meta.description || site.description),
    title: esc(meta.title),
    initialTheme: meta.theme || 'light',
    phone: esc(site.phone),
    phoneHref: site.phoneHref,
    email: esc(site.email),
    emailHref: site.emailHref,
    rating: site.rating,
    ratingCount: site.ratingCount,
    year: new Date().getFullYear(),
    storiesTotal: ('0' + site.testimonials.length).slice(-2),
    navLabel: esc(meta.navLabel),
    bodyClass: meta.bodyClass || '',
    address: site.address.map(esc).join('<br>'),
    // fragments
    menuPrimary: navLinksBig(base, meta.active),
    menuSecondary: navLinksSecondary(base, meta.active),
    footerNav: footerNav(base, meta.active),
    socials: socialLinks(),
    quoteBtn: quoteButton('Get a quote', base, { variant: 'ghost' }),
    quoteBtnLight: quoteButton('Get a quote', base, { variant: 'light' }),
    quoteBtnDark: quoteButton('Get a quote', base, { variant: 'dark' })
  };
}

function applyPartials(html) {
  return html.replace(/\{\{>\s*([\w-]+)\s*\}\}/g, (_, name) => applyPartials(partial(name)));
}
function applyVars(html, ctx) {
  return html.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (m, key) => {
    const v = key.split('.').reduce((o, k) => (o == null ? undefined : o[k]), ctx);
    if (v === undefined || v === null) throw new Error('Missing template var: {{ ' + key + ' }}');
    return String(v);
  });
}

/* Body builders that need helper functions (cards etc.) are injected as tokens */
function pageTokens(base) {
  return {
    PRODUCT_CARDS: productCards(base),
    PROJECT_CARDS: projectCards(base),
    PROJECT_CARDS_3: projectCards(base, 4),
    TESTIMONIALS: testimonialSlides(),
    NEWS_LIST: newsList(base),
    SERVICES_LIST: servicesList(),
    APPROACH_STEPS: approachSteps(base),
    PRODUCT_SECTIONS: productSections(),
    PAVILION: pavilion(),
    BTN_WHO: button('Who we are', 'about.html', base, { variant: 'dark' }),
    BTN_COLLECTION: button('Product overview', 'collection.html', base, { variant: 'ghost' }),
    BTN_PROJECTS: button('All projects', 'projects.html', base, { variant: 'ghost' }),
    BTN_SHOWROOM: button('Visit the showroom', 'showroom.html', base, { variant: 'light' }),
    BTN_APPROACH: button('Our approach', 'approach.html', base, { variant: 'ghost' }),
    BTN_CONTACT: button('Contact us', 'contact.html', base, { variant: 'dark' }),
    BTN_NEWS: button('All news', 'news.html', base, { variant: 'ghost' }),
    SCENE_HERO_INTERIOR: interior('day'),
    SCENE_SHOWROOM: interior('coast'),
    SCENE_ABOUT: house('cottage'),
    SCENE_DETAIL: detail('day'),
    SCENE_BLUEPRINT: blueprint()
  };
}
function applyTokens(html, tokens) {
  return html.replace(/<!--\s*@([A-Z0-9_]+)\s*-->/g, (m, key) => {
    if (!(key in tokens)) throw new Error('Missing body token: ' + key);
    return tokens[key];
  });
}

function render(file, meta, base) {
  let html = read(join(SRC, 'pages', file));
  html = applyTokens(html, pageTokens(base));      // body fragments (cards etc.)
  html = applyPartials(html);                       // {{> head }} etc.
  html = applyVars(html, context(base, meta));      // {{ vars }}
  // accessibility: leftover token guard
  const leftover = html.match(/\{\{[^}]+\}\}|<!--\s*@[A-Z0-9_]+\s*-->/);
  if (leftover) throw new Error(`Unresolved template token in ${file}: ${leftover[0]}`);
  return html;
}

/* ---------------------------------------------------------------- build    */
function build() {
  if (existsSync(DIST)) rmSync(DIST, { recursive: true });
  mkdirSync(DIST, { recursive: true });

  // top-level pages
  for (const [file, meta] of Object.entries(PAGES)) {
    writeFileSync(join(DIST, file), render(file, meta, ''));
  }

  // project detail pages (dynamic [slug])
  mkdirSync(join(DIST, 'projects'), { recursive: true });
  const tpl = read(join(SRC, 'pages', '_project.html'));
  for (const pr of site.projects) {
    const base = '../';
    const meta = { active: 'projects', navLabel: 'Projects', title: pr.name + ' — ' + site.brand, description: pr.summary, theme: 'dark' };
    const factRows = pr.facts.map(([k, v]) => `<div class="fact"><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('');
    const storyP = pr.story.map((s) => `<p>${esc(s)}</p>`).join('');
    const tags = pr.tags.map((t) => `<span>${esc(t)}</span>`).join('');
    const idx = site.projects.findIndex((x) => x.slug === pr.slug);
    const next = site.projects[(idx + 1) % site.projects.length];
    let html = tpl
      .replace(/<!--\s*@PROJECT_NAME\s*-->/g, esc(pr.name))
      .replace(/<!--\s*@PROJECT_LOCATION\s*-->/g, esc(pr.location))
      .replace(/<!--\s*@PROJECT_YEAR\s*-->/g, esc(pr.year))
      .replace(/<!--\s*@PROJECT_INTRO\s*-->/g, esc(pr.intro))
      .replace(/<!--\s*@PROJECT_TAGS\s*-->/g, tags)
      .replace(/<!--\s*@PROJECT_FACTS\s*-->/g, factRows)
      .replace(/<!--\s*@PROJECT_STORY\s*-->/g, storyP)
      .replace(/<!--\s*@PROJECT_HERO\s*-->/g, house(pr.scene, { ratio: '16 / 9' }))
      .replace(/<!--\s*@PROJECT_INT\s*-->/g, interior(pr.scene === 'moor' ? 'moor' : 'day'))
      .replace(/<!--\s*@PROJECT_DETAIL\s*-->/g, detail(pr.scene))
      .replace(/<!--\s*@NEXT_HREF\s*-->/g, base + 'projects/' + next.slug + '.html')
      .replace(/<!--\s*@NEXT_NAME\s*-->/g, esc(next.name))
      .replace(/<!--\s*@NEXT_SCENE\s*-->/g, house(next.scene, { ratio: '21 / 9' }));
    html = applyTokens(html, pageTokens(base));
    html = applyPartials(html);
    html = applyVars(html, context(base, meta));
    const leftover = html.match(/\{\{[^}]+\}\}|<!--\s*@[A-Z0-9_]+\s*-->/);
    if (leftover) throw new Error(`Unresolved token in project ${pr.slug}: ${leftover[0]}`);
    writeFileSync(join(DIST, 'projects', pr.slug + '.html'), html);
  }

  // assets
  copyDir(join(SRC, 'assets'), join(DIST, 'assets'));

  // concatenated styles + scripts
  const cssOrder = ['tokens.css', 'base.css', 'layout.css', 'nav.css', 'components.css', 'sections.css', 'pages.css', 'responsive.css'];
  const jsOrder = ['core.js', 'smooth-scroll.js', 'motion.js', 'split.js', 'hero.js', 'loader.js', 'nav.js', 'menu.js', 'quote.js', 'stories.js', 'cursor.js', 'cookie.js', 'main.js'];
  writeFileSync(join(DIST, 'app.css'), concat('styles', cssOrder));
  writeFileSync(join(DIST, 'app.js'), concat('scripts', jsOrder));

  // pages-as-static helpers
  writeFileSync(join(DIST, '.nojekyll'), '');
  writeFileSync(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${site.url}sitemap.xml\n`);
  const urls = [...Object.keys(PAGES).map((f) => f === 'index.html' ? '' : f),
    ...site.projects.map((p) => 'projects/' + p.slug + '.html')];
  writeFileSync(join(DIST, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map((u) => `  <url><loc>${site.url}${u}</loc></url>`).join('\n') + `\n</urlset>\n`);

  console.log('Built', Object.keys(PAGES).length, 'pages +', site.projects.length, 'project pages -> dist/');
}

build();
