// Self-contained SVG "scenes" (architectural glazing art). Deterministic ids per `u`
// so server-rendered and client markup match (no hydration mismatch).
const PAL: Record<string, any> = {
  barn: { sky: ['#ecdfc2', '#d8c298', '#b5a071'], ground: '#7f9a58', wall: '#2c261d55', glass: '#f5ecd6', glassEdge: '#23311f', sun: '#ffe9c0', sunX: 640, sea: false },
  cottage: { sky: ['#f1e5cf', '#dec9a6', '#bda884'], ground: '#94a763', wall: '#9c5c3855', glass: '#f7efdd', glassEdge: '#5e3a24', sun: '#fff1d2', sunX: 190, sea: false },
  coast: { sky: ['#ddece2', '#bedccb', '#9bc4ad'], ground: '#5d9a86', wall: '#efe7d255', glass: '#e9f4e9', glassEdge: '#2b4034', sun: '#fffaee', sunX: 620, sea: true },
  moor: { sky: ['#e6c8a6', '#c89c76', '#8d6a55'], ground: '#70634e', wall: '#80452855', glass: '#f1ddc2', glassEdge: '#3a2414', sun: '#ffddae', sunX: 210, sea: false },
  dusk: { sky: ['#f3d8b8', '#dba682', '#8c6a5e'], ground: '#5d5747', wall: '#2c261e55', glass: '#f5e3cc', glassEdge: '#262017', sun: '#ffe8c4', sunX: 600, sea: false },
  day: { sky: ['#eee9d6', '#d8d2b4', '#bcc09a'], ground: '#8aa46e', wall: '#e2dcc6aa', glass: '#f1efdc', glassEdge: '#374432', sun: '#fffdf2', sunX: 560, sea: false }
}

function house(palKey = 'day', u = 'h') {
  const p = PAL[palKey] || PAL.day
  const ground = p.sea
    ? `<rect x="0" y="430" width="800" height="170" fill="${p.ground}"/><g opacity=".5" stroke="#fff" stroke-width="1"><line x1="0" y1="470" x2="800" y2="470"/><line x1="0" y1="505" x2="800" y2="505"/><line x1="0" y1="545" x2="800" y2="545"/></g>`
    : `<path d="M0 430 Q 400 405 800 432 L800 600 L0 600 Z" fill="${p.ground}"/>`
  return `<svg class="scene" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true">
    <defs>
      <linearGradient id="sky${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.sky[0]}"/><stop offset=".55" stop-color="${p.sky[1]}"/><stop offset="1" stop-color="${p.sky[2]}"/></linearGradient>
      <radialGradient id="sun${u}" cx="${p.sunX / 800}" cy=".28" r=".5"><stop offset="0" stop-color="${p.sun}" stop-opacity=".95"/><stop offset="1" stop-color="${p.sun}" stop-opacity="0"/></radialGradient>
      <linearGradient id="glass${u}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${p.glass}" stop-opacity=".95"/><stop offset=".5" stop-color="${p.glass}" stop-opacity=".55"/><stop offset="1" stop-color="${p.glass}" stop-opacity=".85"/></linearGradient>
    </defs>
    <rect width="800" height="600" fill="url(#sky${u})"/>
    <circle cx="${p.sunX}" cy="150" r="240" fill="url(#sun${u})"/>
    <path d="M0 360 Q 220 300 430 350 T 800 340 L800 460 L0 460 Z" fill="#000" opacity=".06"/>
    ${ground}
    <g>
      <path d="M250 430 L250 250 L470 250 L470 430 Z" fill="${p.wall}"/>
      <path d="M235 252 L360 175 L485 252 Z" fill="${p.glassEdge}" opacity=".9"/>
      <rect x="270" y="280" width="180" height="150" fill="url(#glass${u})" stroke="${p.glassEdge}" stroke-width="3"/>
      <g stroke="${p.glassEdge}" stroke-width="2" opacity=".7"><line x1="330" y1="280" x2="330" y2="430"/><line x1="390" y1="280" x2="390" y2="430"/><line x1="270" y1="355" x2="450" y2="355"/></g>
      <path d="M285 290 L330 290 L300 430 L285 430 Z" fill="#fff" opacity=".25"/>
      <path d="M470 360 L600 360 L600 430 L470 430 Z" fill="${p.glassEdge}" opacity=".18"/>
      <rect x="490" y="372" width="100" height="58" fill="url(#glass${u})" stroke="${p.glassEdge}" stroke-width="2"/>
    </g>
  </svg>`
}

function interior(palKey = 'day', u = 'i') {
  const p = PAL[palKey] || PAL.day
  return `<svg class="scene" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true">
    <defs><linearGradient id="ig${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.sky[0]}"/><stop offset="1" stop-color="${p.sky[2]}"/></linearGradient>
    <linearGradient id="if${u}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".3"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
    <rect width="800" height="600" fill="#1b1c1e"/>
    <rect x="120" y="70" width="560" height="430" fill="url(#ig${u})"/>
    <g stroke="#0e0f10" stroke-width="10"><rect x="120" y="70" width="560" height="430" fill="none"/><line x1="307" y1="70" x2="307" y2="500"/><line x1="493" y1="70" x2="493" y2="500"/></g>
    <path d="M140 90 L260 90 L180 480 L140 480 Z" fill="url(#if${u})"/>
    <rect x="0" y="500" width="800" height="100" fill="#141517"/><rect x="90" y="430" width="150" height="70" fill="#26282b"/>
  </svg>`
}

function detail(palKey = 'day', u = 'd') {
  const p = PAL[palKey] || PAL.day
  return `<svg class="scene" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true">
    <defs><linearGradient id="dg${u}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${p.sky[1]}"/><stop offset="1" stop-color="${p.glassEdge}"/></linearGradient></defs>
    <rect width="800" height="600" fill="url(#dg${u})"/>
    <g stroke="#0c0d0e" stroke-width="14" fill="none"><path d="M-20 180 L520 -20"/><path d="M120 620 L640 120"/></g>
    <g stroke="#fff" stroke-width="2" opacity=".5"><path d="M-20 210 L520 10"/><path d="M150 640 L660 150"/></g>
    <circle cx="560" cy="240" r="46" fill="#0c0d0e"/><circle cx="560" cy="240" r="20" fill="#2c2e31"/>
    <path d="M520 360 L820 220 L820 600 L380 600 Z" fill="#000" opacity=".25"/>
  </svg>`
}

function blueprint(u = 'b') {
  return `<svg class="scene" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true">
    <defs><pattern id="grid${u}" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0 L0 0 0 40" fill="none" stroke="#3a4658" stroke-width="1"/></pattern>
    <linearGradient id="bb${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#10151d"/><stop offset="1" stop-color="#1a2230"/></linearGradient></defs>
    <rect width="800" height="600" fill="url(#bb${u})"/><rect width="800" height="600" fill="url(#grid${u})"/>
    <g stroke="#9fb4cf" stroke-width="2" fill="none" opacity=".9"><rect x="180" y="150" width="300" height="220"/><rect x="480" y="150" width="160" height="220"/><line x1="180" y1="260" x2="640" y2="260"/><line x1="330" y1="150" x2="330" y2="370"/><path d="M180 370 L180 420 L640 420 L640 370"/><circle cx="330" cy="260" r="46" stroke-dasharray="5 5"/></g>
    <g stroke="#cfe0f5" stroke-width="1.4" opacity=".8"><line x1="180" y1="120" x2="640" y2="120"/><path d="M180 112 l8 8 l-8 8"/><path d="M640 112 l-8 8 l8 8"/></g>
  </svg>`
}

function product(key = 'doors', u = 'p') {
  const map: Record<string, any> = {
    doors: { bg: ['#eef0da', '#d3d8b4'], edge: '#2c3a24', sheen: '#fffbe9' },
    windows: { bg: ['#f1e8d2', '#dbcaa6'], edge: '#3a3322', sheen: '#fff' },
    additional: { bg: ['#f3e4d0', '#e0c5a4'], edge: '#46301c', sheen: '#fff5e4' },
    structural: { bg: ['#ece7da', '#d2cab6'], edge: '#322e24', sheen: '#fff' }
  }
  const p = map[key] || map.doors
  let art = ''
  if (key === 'doors') art = `<g stroke="${p.edge}" stroke-width="4"><rect x="180" y="150" width="220" height="320" fill="none"/><rect x="400" y="150" width="220" height="320" fill="none"/><line x1="290" y1="150" x2="290" y2="470"/><line x1="510" y1="150" x2="510" y2="470"/></g><path d="M210 175 L260 175 L230 450 L210 450 Z" fill="${p.sheen}" opacity=".5"/>`
  else if (key === 'windows') art = `<g stroke="${p.edge}" stroke-width="4" fill="none"><rect x="220" y="160" width="360" height="300"/><line x1="400" y1="160" x2="400" y2="460"/><line x1="220" y1="310" x2="580" y2="310"/></g><path d="M250 185 L300 185 L270 290 L250 290 Z" fill="${p.sheen}" opacity=".5"/>`
  else if (key === 'additional') art = `<g stroke="${p.edge}" stroke-width="4" fill="none"><path d="M210 430 L300 200 L500 200 L590 430 Z"/><line x1="300" y1="200" x2="350" y2="430"/><line x1="500" y1="200" x2="450" y2="430"/><line x1="328" y1="315" x2="472" y2="315"/></g><path d="M320 215 L360 215 L335 300 L318 300 Z" fill="${p.sheen}" opacity=".5"/>`
  else art = `<g stroke="${p.edge}" stroke-width="4" fill="none"><rect x="170" y="170" width="460" height="280"/><line x1="400" y1="170" x2="400" y2="450"/></g><path d="M200 195 L260 195 L210 430 L200 430 Z" fill="${p.sheen}" opacity=".45"/><circle cx="400" cy="310" r="7" fill="${p.edge}"/>`
  return `<svg class="scene" viewBox="0 0 800 620" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true">
    <defs><linearGradient id="pg${u}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${p.bg[0]}"/><stop offset="1" stop-color="${p.bg[1]}"/></linearGradient></defs>
    <rect width="800" height="620" fill="url(#pg${u})"/>${art}
  </svg>`
}

function pavilion() {
  const geo = `
    <path class="pv-roof" d="M120 250 L400 175 L1080 250 L1080 295 L120 295 Z"/>
    <path class="pv-floor" d="M120 560 L1080 560 L1080 600 L120 600 Z"/>
    <g class="pv-frame"><rect x="150" y="295" width="820" height="265"/><line x1="370" y1="295" x2="370" y2="560"/><line x1="560" y1="295" x2="560" y2="560"/><line x1="760" y1="295" x2="760" y2="560"/><rect x="970" y="295" width="110" height="265"/></g>
    <g class="pv-detail"><path d="M205 545 q12 -40 0 -78 q-14 -30 6 -52"/><circle cx="300" cy="500" r="18"/><rect x="430" y="470" width="70" height="70"/><path d="M620 540 q20 -60 70 -70 q-40 30 -30 70"/><path d="M1010 545 q10 -50 -6 -90 q18 20 36 8"/></g>
    <g class="pv-foliage"><path d="M120 250 q60 -70 130 -64 q-30 -50 50 -70 q40 -40 110 -10 q60 -40 120 -2 q70 -34 140 4 q60 -30 120 6 q60 -16 80 30"/></g>`
  return `<svg class="pavilion" viewBox="0 0 1200 640" preserveAspectRatio="xMidYMax meet" role="img" aria-label="Line drawing of a glass pavilion">
    <defs>
      <linearGradient id="pvsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eadfc2"/><stop offset="1" stop-color="#f2eedd"/></linearGradient>
      <linearGradient id="pvglass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#dde2c2"/><stop offset=".5" stop-color="#c2cda4"/><stop offset="1" stop-color="#e6e8cc"/></linearGradient>
      <clipPath id="pvclip"><rect x="0" y="0" width="1200" height="640"/></clipPath>
    </defs>
    <g class="pavilion__fill" clip-path="url(#pvclip)">
      <rect x="120" y="175" width="960" height="425" fill="url(#pvsky)"/>
      <rect x="150" y="295" width="820" height="265" fill="url(#pvglass)"/>
      <rect x="970" y="295" width="110" height="265" fill="#c9c2b4"/>
      <path d="M120 250 L400 175 L1080 250 L1080 295 L120 295 Z" fill="#dfe3df"/>
      <path d="M120 560 L1080 560 L1080 600 L120 600 Z" fill="#cdbfa8"/>
    </g>
    <g class="pavilion__line">${geo}</g>
  </svg>`
}

export function useScenes() {
  return { house, interior, detail, blueprint, product, pavilion }
}
