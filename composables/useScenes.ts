// Self-contained SVG "scenes" (architectural glazing art). Deterministic ids per `u`
// so server-rendered and client markup match (no hydration mismatch).
const PAL: Record<string, any> = {
  barn:    { sky: ['#e8dab8','#d4b880','#b59058'], ground: '#6a8f48', wall: '#2a241a66', glass: '#f2e8cc', glassEdge: '#1e2c18', sun: '#ffeaaa', sunX: 640, sea: false },
  cottage: { sky: ['#f0e3cb','#ddc69e','#c0a47a'], ground: '#88a056', wall: '#9a583266', glass: '#f5edd8', glassEdge: '#5a381e', sun: '#fff3d0', sunX: 190, sea: false },
  coast:   { sky: ['#d8eae0','#b8d9c8','#96c2ae'], ground: '#508a74', wall: '#e8e0cc66', glass: '#e4f0e6', glassEdge: '#264034', sun: '#fffcee', sunX: 620, sea: true  },
  moor:    { sky: ['#e2c49e','#c4986a','#8a6450'], ground: '#6a5e48', wall: '#7c422666', glass: '#ecd9be', glassEdge: '#381e10', sun: '#ffd898', sunX: 210, sea: false },
  dusk:    { sky: ['#f0d4b0','#d8a078','#8c6458'], ground: '#585244', wall: '#2a241c66', glass: '#f2dfca', glassEdge: '#221c14', sun: '#ffe4b8', sunX: 600, sea: false },
  day:     { sky: ['#ece6d2','#d4ceb0','#b8bc96'], ground: '#84a068', wall: '#ddd8c0aa', glass: '#eeebd8', glassEdge: '#323e2e', sun: '#fffdee', sunX: 560, sea: false },
  hero:    { sky: ['#e8e2ce','#d0caac','#b4b892'], ground: '#7e9a62', wall: '#30281e88', glass: '#eceadc', glassEdge: '#28341e', sun: '#fffeee', sunX: 580, sea: false }
}

function house(palKey = 'day', u = 'h') {
  const p = PAL[palKey] || PAL.day
  const groundPath = p.sea
    ? `<rect x="0" y="432" width="800" height="168" fill="${p.ground}"/>
       <g opacity=".38" stroke="#fff" stroke-width="1.2">
         <path d="M0 466 Q200 462 400 468 T800 464"/><path d="M0 498 Q200 494 400 500 T800 496"/>
         <path d="M0 530 Q200 528 400 532 T800 530"/>
       </g>`
    : `<path d="M0 432 C200 410 400 408 600 416 C700 420 760 428 800 432 L800 600 L0 600 Z" fill="${p.ground}"/>
       <path d="M0 432 C200 424 400 422 600 428 C700 432 760 436 800 438" fill="none" stroke="${p.ground}" stroke-width="0"/>`

  // richer tree silhouettes on the skyline
  const trees = `
    <g fill="${p.glassEdge}" opacity=".22">
      <ellipse cx="92" cy="352" rx="34" ry="52"/>
      <rect x="88" y="388" width="8" height="42"/>
      <ellipse cx="140" cy="366" rx="22" ry="36"/>
      <rect x="136" y="396" width="8" height="36"/>
      <ellipse cx="672" cy="358" rx="28" ry="44"/>
      <rect x="668" y="390" width="8" height="40"/>
      <ellipse cx="714" cy="372" rx="18" ry="30"/>
      <rect x="710" y="396" width="8" height="34"/>
    </g>`

  // more refined building: pitched roof, deeper glass, side wing
  return `<svg class="scene" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true">
    <defs>
      <linearGradient id="sky${u}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${p.sky[0]}"/><stop offset=".5" stop-color="${p.sky[1]}"/><stop offset="1" stop-color="${p.sky[2]}"/>
      </linearGradient>
      <radialGradient id="sun${u}" cx="${p.sunX / 800}" cy=".22" r=".55">
        <stop offset="0" stop-color="${p.sun}" stop-opacity=".9"/><stop offset="1" stop-color="${p.sun}" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="glass${u}" x1="0" y1="0" x2=".6" y2="1">
        <stop offset="0" stop-color="${p.glass}" stop-opacity=".92"/>
        <stop offset=".4" stop-color="${p.glass}" stop-opacity=".52"/>
        <stop offset="1" stop-color="${p.glass}" stop-opacity=".82"/>
      </linearGradient>
      <linearGradient id="sheen${u}" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
      </linearGradient>
    </defs>

    <!-- sky & sun -->
    <rect width="800" height="600" fill="url(#sky${u})"/>
    <circle cx="${p.sunX}" cy="130" r="280" fill="url(#sun${u})"/>

    <!-- ambient haze near horizon -->
    <path d="M0 370 Q 260 330 480 356 T 800 348 L800 440 L0 440 Z" fill="#fff" opacity=".06"/>

    ${groundPath}
    ${trees}

    <!-- main structure — wider, lower proportions, solid fascia -->
    <!-- fascia / eave overhang -->
    <path d="M190 252 L610 252 L610 264 L190 264 Z" fill="${p.glassEdge}" opacity=".85"/>
    <!-- pitched roof -->
    <path d="M186 264 L400 168 L614 264 Z" fill="${p.glassEdge}" opacity=".88"/>
    <!-- roof highlight ridge -->
    <path d="M400 172 L400 264" stroke="${p.glass}" stroke-width="1.5" opacity=".4"/>

    <!-- main building body -->
    <rect x="190" y="264" width="420" height="166" fill="${p.wall}"/>

    <!-- full-height glazing panels (4 bays) -->
    <rect x="204" y="276" width="88" height="142" fill="url(#glass${u})" stroke="${p.glassEdge}" stroke-width="2"/>
    <rect x="300" y="276" width="88" height="142" fill="url(#glass${u})" stroke="${p.glassEdge}" stroke-width="2"/>
    <rect x="396" y="276" width="88" height="142" fill="url(#glass${u})" stroke="${p.glassEdge}" stroke-width="2"/>
    <rect x="492" y="276" width="106" height="142" fill="url(#glass${u})" stroke="${p.glassEdge}" stroke-width="2"/>

    <!-- mullion cross-bars -->
    <g stroke="${p.glassEdge}" stroke-width="1.5" opacity=".55">
      <line x1="204" y1="347" x2="292" y2="347"/><line x1="300" y1="347" x2="388" y2="347"/>
      <line x1="396" y1="347" x2="484" y2="347"/><line x1="492" y1="347" x2="598" y2="347"/>
    </g>

    <!-- glass sheen / reflections -->
    <rect x="204" y="276" width="88" height="142" fill="url(#sheen${u})" opacity=".6"/>
    <rect x="396" y="276" width="88" height="142" fill="url(#sheen${u})" opacity=".4"/>

    <!-- entry canopy / porch -->
    <path d="M328 416 L328 430 L472 430 L472 416 L400 404 Z" fill="${p.glassEdge}" opacity=".75"/>
    <rect x="336" y="416" width="128" height="14" fill="${p.glass}" opacity=".4"/>

    <!-- side wing / garage -->
    <rect x="610" y="310" width="90" height="120" fill="${p.wall}" opacity=".8"/>
    <rect x="622" y="322" width="68" height="88" fill="url(#glass${u})" stroke="${p.glassEdge}" stroke-width="1.5"/>

    <!-- plinth / base strip -->
    <rect x="190" y="428" width="510" height="8" fill="${p.glassEdge}" opacity=".4"/>

    <!-- driveway path -->
    <path d="M340 436 Q400 444 400 520" stroke="${p.glassEdge}" stroke-width="14" stroke-linecap="round" fill="none" opacity=".12"/>
  </svg>`
}

function interior(palKey = 'day', u = 'i') {
  const p = PAL[palKey] || PAL.day
  // richer interior: framed window view, furniture silhouettes, wall panelling
  return `<svg class="scene" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true">
    <defs>
      <linearGradient id="ig${u}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${p.sky[0]}"/><stop offset="1" stop-color="${p.sky[2]}"/>
      </linearGradient>
      <linearGradient id="ifloor${u}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#a8946a"/><stop offset="1" stop-color="#8a7654"/>
      </linearGradient>
      <linearGradient id="isheen${u}" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#fff" stop-opacity=".32"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
      </linearGradient>
    </defs>

    <!-- room walls -->
    <rect width="800" height="600" fill="#1a1b1e"/>

    <!-- large window opening showing daylight -->
    <rect x="90" y="58" width="560" height="390" fill="url(#ig${u})" rx="4"/>

    <!-- window frame – thick dark surround -->
    <g stroke="#0d0e10" stroke-width="14" fill="none">
      <rect x="90" y="58" width="560" height="390" rx="4"/>
      <line x1="276" y1="58" x2="276" y2="448"/>
      <line x1="462" y1="58" x2="462" y2="448"/>
      <line x1="90" y1="253" x2="650" y2="253"/>
    </g>
    <!-- inner frame reveal shadow -->
    <g stroke="#000" stroke-width="3" fill="none" opacity=".35">
      <rect x="97" y="65" width="546" height="376" rx="2"/>
    </g>

    <!-- glass sheen on window -->
    <rect x="90" y="58" width="560" height="390" fill="url(#isheen${u})" rx="4"/>

    <!-- ceiling cornice shadow -->
    <path d="M0 0 L800 0 L800 52 Q400 62 0 52 Z" fill="#141517" opacity=".7"/>

    <!-- floor -->
    <rect x="0" y="504" width="800" height="96" fill="url(#ifloor${u})"/>
    <!-- floor board lines -->
    <g stroke="#8a7452" stroke-width="1" opacity=".4">
      <line x1="0" y1="528" x2="800" y2="528"/><line x1="0" y1="546" x2="800" y2="546"/>
      <line x1="0" y1="562" x2="800" y2="562"/><line x1="0" y1="578" x2="800" y2="578"/>
      <line x1="160" y1="504" x2="120" y2="600"/><line x1="320" y1="504" x2="280" y2="600"/>
      <line x1="480" y1="504" x2="440" y2="600"/><line x1="640" y1="504" x2="600" y2="600"/>
    </g>

    <!-- baseboard -->
    <rect x="0" y="500" width="800" height="8" fill="#222326"/>

    <!-- furniture silhouettes: sofa + side table -->
    <rect x="80" y="448" width="220" height="56" rx="8" fill="#26282c"/>
    <rect x="88" y="440" width="204" height="14" rx="6" fill="#1e2022"/>
    <!-- cushions -->
    <rect x="92" y="452" width="60" height="44" rx="4" fill="#32353a"/>
    <rect x="160" y="452" width="60" height="44" rx="4" fill="#2e3136"/>
    <rect x="228" y="452" width="64" height="44" rx="4" fill="#32353a"/>

    <!-- side table + lamp -->
    <rect x="316" y="480" width="42" height="24" rx="3" fill="#1e2022"/>
    <path d="M337 480 L337 452 L352 452 L352 480" fill="none" stroke="#32353a" stroke-width="2"/>
    <ellipse cx="337" cy="440" rx="18" ry="12" fill="#3a3c40" stroke="#444" stroke-width="1"/>

    <!-- wall sconce / art panel (right wall hint) -->
    <rect x="694" y="140" width="4" height="280" fill="#222426" opacity=".9"/>
    <rect x="700" y="160" width="86" height="200" rx="4" fill="#1c1e22"/>
    <rect x="706" y="170" width="74" height="180" rx="2" fill="#242630" opacity=".8"/>
  </svg>`
}

function detail(palKey = 'day', u = 'd') {
  const p = PAL[palKey] || PAL.day
  // refined architectural detail: material texture study + accent element
  return `<svg class="scene" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true">
    <defs>
      <linearGradient id="dg${u}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${p.sky[0]}"/><stop offset="1" stop-color="${p.glassEdge}"/>
      </linearGradient>
      <linearGradient id="dmat${u}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#c8baa4"/><stop offset="1" stop-color="#a49278"/>
      </linearGradient>
    </defs>
    <rect width="800" height="600" fill="url(#dg${u})"/>

    <!-- material panel grid (marble / tile pattern) -->
    <g opacity=".18" stroke="${p.glassEdge}" stroke-width="1" fill="none">
      <rect x="0" y="0" width="800" height="600"/>
      <line x1="0" y1="120" x2="800" y2="120"/><line x1="0" y1="240" x2="800" y2="240"/>
      <line x1="0" y1="360" x2="800" y2="360"/><line x1="0" y1="480" x2="800" y2="480"/>
      <line x1="160" y1="0" x2="160" y2="600"/><line x1="320" y1="0" x2="320" y2="600"/>
      <line x1="480" y1="0" x2="480" y2="600"/><line x1="640" y1="0" x2="640" y2="600"/>
    </g>

    <!-- bold diagonal accent lines (structural reference) -->
    <g stroke="${p.glassEdge}" stroke-width="8" opacity=".55" fill="none" stroke-linecap="round">
      <line x1="-10" y1="175" x2="520" y2="-15"/>
      <line x1="130" y1="615" x2="650" y2="115"/>
    </g>
    <g stroke="#fff" stroke-width="1.6" opacity=".38" fill="none">
      <line x1="-10" y1="205" x2="520" y2="14"/>
      <line x1="160" y1="630" x2="670" y2="140"/>
    </g>

    <!-- feature circle — detail element / rosette -->
    <circle cx="570" cy="228" r="58" fill="${p.glassEdge}" opacity=".9"/>
    <circle cx="570" cy="228" r="40" fill="#fff" opacity=".08"/>
    <circle cx="570" cy="228" r="22" fill="${p.glassEdge}"/>
    <circle cx="570" cy="228" r="10" fill="#fff" opacity=".22"/>

    <!-- shadow wedge -->
    <path d="M520 340 L820 195 L820 600 L380 600 Z" fill="#000" opacity=".22"/>

    <!-- material strip hint at bottom -->
    <rect x="0" y="550" width="800" height="50" fill="url(#dmat${u})" opacity=".3"/>
  </svg>`
}

function blueprint(u = 'b') {
  return `<svg class="scene" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true">
    <defs>
      <pattern id="grid${u}" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M40 0 L0 0 0 40" fill="none" stroke="#3a4658" stroke-width="1"/>
      </pattern>
      <linearGradient id="bb${u}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#10151d"/><stop offset="1" stop-color="#1a2230"/>
      </linearGradient>
    </defs>
    <rect width="800" height="600" fill="url(#bb${u})"/>
    <rect width="800" height="600" fill="url(#grid${u})"/>
    <g stroke="#9fb4cf" stroke-width="2" fill="none" opacity=".9">
      <rect x="180" y="150" width="300" height="220"/>
      <rect x="480" y="150" width="160" height="220"/>
      <line x1="180" y1="260" x2="640" y2="260"/>
      <line x1="330" y1="150" x2="330" y2="370"/>
      <path d="M180 370 L180 420 L640 420 L640 370"/>
      <circle cx="330" cy="260" r="46" stroke-dasharray="5 5"/>
    </g>
    <g stroke="#cfe0f5" stroke-width="1.4" opacity=".8">
      <line x1="180" y1="120" x2="640" y2="120"/>
      <path d="M180 112 l8 8 l-8 8"/>
      <path d="M640 112 l-8 8 l8 8"/>
    </g>
  </svg>`
}

function product(key = 'doors', u = 'p') {
  const map: Record<string, any> = {
    doors:      { bg: ['#eef0da', '#d3d8b4'], edge: '#2c3a24', sheen: '#fffbe9' },
    windows:    { bg: ['#f1e8d2', '#dbcaa6'], edge: '#3a3322', sheen: '#fff' },
    additional: { bg: ['#f3e4d0', '#e0c5a4'], edge: '#46301c', sheen: '#fff5e4' },
    structural: { bg: ['#ece7da', '#d2cab6'], edge: '#322e24', sheen: '#fff' }
  }
  const p = map[key] || map.doors
  let art = ''
  if (key === 'doors') {
    art = `<g stroke="${p.edge}" stroke-width="3.5" fill="none">
      <rect x="180" y="148" width="208" height="310" rx="2"/>
      <rect x="396" y="148" width="208" height="310" rx="2"/>
      <line x1="284" y1="148" x2="284" y2="458"/>
      <line x1="500" y1="148" x2="500" y2="458"/>
      <line x1="180" y1="302" x2="388" y2="302"/>
      <line x1="396" y1="302" x2="604" y2="302"/>
    </g>
    <path d="M212 178 L258 178 L230 438 L212 438 Z" fill="${p.sheen}" opacity=".45"/>
    <path d="M428 178 L472 178 L444 438 L428 438 Z" fill="${p.sheen}" opacity=".35"/>
    <!-- door handle hints -->
    <circle cx="372" cy="310" r="7" fill="${p.edge}" opacity=".7"/>
    <circle cx="412" cy="310" r="7" fill="${p.edge}" opacity=".7"/>`
  } else if (key === 'windows') {
    art = `<g stroke="${p.edge}" stroke-width="3.5" fill="none">
      <rect x="210" y="158" width="380" height="290" rx="2"/>
      <line x1="400" y1="158" x2="400" y2="448"/>
      <line x1="210" y1="303" x2="590" y2="303"/>
    </g>
    <path d="M240 185 L285 185 L258 285 L240 285 Z" fill="${p.sheen}" opacity=".48"/>
    <path d="M420 185 L462 185 L440 285 L420 285 Z" fill="${p.sheen}" opacity=".34"/>
    <!-- latch -->
    <rect x="392" y="296" width="16" height="16" rx="3" fill="${p.edge}" opacity=".6"/>`
  } else if (key === 'additional') {
    art = `<g stroke="${p.edge}" stroke-width="3.5" fill="none">
      <path d="M215 438 L310 198 L490 198 L585 438 Z" rx="2"/>
      <line x1="310" y1="198" x2="358" y2="438"/>
      <line x1="490" y1="198" x2="442" y2="438"/>
      <line x1="330" y1="318" x2="470" y2="318"/>
    </g>
    <path d="M325 215 L365 215 L338 308 L322 308 Z" fill="${p.sheen}" opacity=".48"/>`
  } else {
    art = `<g stroke="${p.edge}" stroke-width="3.5" fill="none">
      <rect x="168" y="168" width="464" height="276" rx="2"/>
      <line x1="400" y1="168" x2="400" y2="444"/>
      <line x1="168" y1="306" x2="632" y2="306"/>
    </g>
    <path d="M200 195 L255 195 L210 424 L200 424 Z" fill="${p.sheen}" opacity=".42"/>
    <circle cx="400" cy="306" r="8" fill="${p.edge}" opacity=".6"/>`
  }
  return `<svg class="scene" viewBox="0 0 800 620" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true">
    <defs>
      <linearGradient id="pg${u}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${p.bg[0]}"/><stop offset="1" stop-color="${p.bg[1]}"/>
      </linearGradient>
    </defs>
    <rect width="800" height="620" fill="url(#pg${u})"/>
    ${art}
  </svg>`
}

function pavilion() {
  // Refined glass pavilion — cleaner geometry, better proportions, on-brand palette.
  // Fills match tokens: --bg-warm / green-ground / glass-tint
  const geo = `
    <!-- foliage canopy on roofline -->
    <g class="pv-foliage">
      <path d="M120 252
        C148 210 180 198 220 214
        C240 180 270 166 306 190
        C330 158 368 150 404 172
        C428 148 464 142 500 162
        C524 138 562 136 598 158
        C624 140 660 148 688 172
        C712 152 748 156 780 184
        C810 196 830 216 840 248"/>
    </g>

    <!-- roof: wider fascia, subtle bevel -->
    <path class="pv-roof" d="M108 255 L400 168 L1092 255 L1092 302 L108 302 Z"/>
    <!-- roof bevel highlight -->
    <path d="M108 255 L400 168 L1092 255" fill="none" class="pv-ridge"/>

    <!-- main glazing hall -->
    <g class="pv-frame">
      <rect x="140" y="302" width="860" height="268"/>
      <!-- four equal bays with double mullions -->
      <line x1="355" y1="302" x2="355" y2="570"/>
      <line x1="362" y1="302" x2="362" y2="570"/>
      <line x1="565" y1="302" x2="565" y2="570"/>
      <line x1="572" y1="302" x2="572" y2="570"/>
      <line x1="775" y1="302" x2="775" y2="570"/>
      <line x1="782" y1="302" x2="782" y2="570"/>
      <!-- transom / horizontal bar at mid height -->
      <line x1="140" y1="436" x2="1000" y2="436"/>
    </g>

    <!-- solid side bay / service wing -->
    <g class="pv-wing">
      <rect x="1000" y="302" width="92" height="268"/>
      <!-- louvre hints -->
      <g class="pv-louver">
        <line x1="1014" y1="336" x2="1078" y2="336"/>
        <line x1="1014" y1="356" x2="1078" y2="356"/>
        <line x1="1014" y1="376" x2="1078" y2="376"/>
        <line x1="1014" y1="396" x2="1078" y2="396"/>
      </g>
    </g>

    <!-- interior furnishing silhouettes (visible through glass) -->
    <g class="pv-detail">
      <!-- planter (left) -->
      <path d="M192 558 Q200 510 192 468 Q178 440 196 420"/>
      <!-- lounge chair -->
      <path d="M280 552 Q272 520 278 498 Q296 488 316 492 Q328 498 320 552 Z"/>
      <!-- side table -->
      <rect x="400" y="524" width="42" height="46"/>
      <line x1="421" y1="524" x2="421" y2="502"/>
      <circle cx="421" cy="496" r="12"/>
      <!-- pendant light (upper zone) -->
      <line x1="590" y1="302" x2="590" y2="374"/>
      <path d="M574 374 Q590 392 606 374 Z"/>
      <!-- sculpture / art piece -->
      <path d="M700 555 Q698 500 710 464 Q722 438 716 418"/>
      <!-- staircase hint -->
      <path d="M820 570 L820 540 L848 540 L848 512 L876 512 L876 480 L904 480 L904 450 L932 450 L932 418 L960 418 L960 390"/>
    </g>

    <!-- floor / plinth -->
    <path class="pv-floor" d="M108 570 L1092 570 L1092 612 L108 612 Z"/>
    <!-- base shadow line -->
    <line x1="140" y1="570" x2="1000" y2="570" class="pv-shadow"/>
  `

  return `<svg class="pavilion" viewBox="0 0 1200 660" preserveAspectRatio="xMidYMax meet" role="img" aria-label="Line drawing of a glass pavilion">
    <defs>
      <linearGradient id="pvsky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#e6dfc8"/><stop offset=".6" stop-color="#eee9d8"/><stop offset="1" stop-color="#f4f2ee"/>
      </linearGradient>
      <linearGradient id="pvglass" x1="0" y1="0" x2=".8" y2="1">
        <stop offset="0" stop-color="#d8dfb8" stop-opacity=".92"/>
        <stop offset=".45" stop-color="#bfcb94" stop-opacity=".55"/>
        <stop offset="1" stop-color="#dde3c0" stop-opacity=".88"/>
      </linearGradient>
      <linearGradient id="pvsheen" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#fff" stop-opacity=".28"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
      </linearGradient>
      <clipPath id="pvclip"><rect x="0" y="0" width="1200" height="660"/></clipPath>
      <filter id="pvblur"><feGaussianBlur stdDeviation="1"/></filter>
    </defs>

    <!-- sky fill -->
    <g clip-path="url(#pvclip)">
      <rect x="0" y="0" width="1200" height="660" fill="url(#pvsky)"/>

      <!-- sun glow -->
      <circle cx="900" cy="120" r="300" fill="#fffadc" opacity=".28"/>
      <circle cx="900" cy="120" r="120" fill="#fffadc" opacity=".22"/>

      <!-- ground plane -->
      <path d="M0 580 C300 565 700 560 1200 572 L1200 660 L0 660 Z" fill="#b8c498" opacity=".55"/>
      <path d="M0 590 C300 575 700 570 1200 582" fill="none" stroke="#a8b488" stroke-width="1.5" opacity=".4"/>

      <!-- glazing fill — behind linework -->
      <rect x="140" y="302" width="860" height="268" fill="url(#pvglass)"/>
      <!-- sheen wash -->
      <rect x="140" y="302" width="860" height="268" fill="url(#pvsheen)"/>

      <!-- wing fill -->
      <rect x="1000" y="302" width="92" height="268" fill="#c6c0b2" opacity=".7"/>

      <!-- roof fill -->
      <path d="M108 255 L400 168 L1092 255 L1092 302 L108 302 Z" fill="#dfe0d4" opacity=".9"/>
      <!-- floor fill -->
      <path d="M108 570 L1092 570 L1092 612 L108 612 Z" fill="#c8bfa8" opacity=".85"/>
    </g>

    <!-- linework layer -->
    <g class="pavilion__line">${geo}</g>
  </svg>`
}

export function useScenes() {
  return { house, interior, detail, blueprint, product, pavilion }
}
