<template>
  <div class="hero-glass" aria-hidden="true" ref="el">
    <!-- ambient glow halo behind the orb -->
    <div class="hero-glass__halo"></div>
    <svg class="hero-glass__svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" overflow="visible">
      <defs>
        <!-- glass refraction filter — displaces edges subtly -->
        <filter id="hg-refract" x="-15%" y="-15%" width="130%" height="130%" color-interpolation-filters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.018 0.014" numOctaves="3" seed="7" result="nz"/>
          <feDisplacementMap in="SourceGraphic" in2="nz" scale="8" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
        <!-- body gradient: glass body — lighter at center to read as translucent -->
        <radialGradient id="hg-body" cx="42%" cy="38%" r="62%">
          <stop offset="0%"   stop-color="rgba(255,255,255,0.16)"/>
          <stop offset="55%"  stop-color="rgba(255,255,255,0.06)"/>
          <stop offset="100%" stop-color="rgba(255,255,255,0.02)"/>
        </radialGradient>
        <!-- large specular catch on upper-left — the glass "window" reflection -->
        <radialGradient id="hg-spec1" cx="28%" cy="20%" r="46%">
          <stop offset="0%"   stop-color="rgba(255,255,255,0.88)"/>
          <stop offset="18%"  stop-color="rgba(255,255,255,0.42)"/>
          <stop offset="48%"  stop-color="rgba(255,255,255,0.08)"/>
          <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
        </radialGradient>
        <!-- secondary small highlight off-center -->
        <radialGradient id="hg-spec2" cx="68%" cy="32%" r="20%">
          <stop offset="0%"   stop-color="rgba(255,255,255,0.52)"/>
          <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
        </radialGradient>
        <!-- caustic refraction spot — lower interior -->
        <radialGradient id="hg-caustic" cx="58%" cy="74%" r="14%">
          <stop offset="0%"   stop-color="rgba(255,240,210,0.55)"/>
          <stop offset="100%" stop-color="rgba(255,240,210,0)"/>
        </radialGradient>
        <!-- depth shadow lower-right — very subtle, just edge darkening -->
        <radialGradient id="hg-depth" cx="68%" cy="74%" r="60%">
          <stop offset="0%"   stop-color="rgba(0,0,0,0.22)"/>
          <stop offset="70%"  stop-color="rgba(0,0,0,0.08)"/>
          <stop offset="100%" stop-color="rgba(0,0,0,0)"/>
        </radialGradient>
        <!-- brand warm tint (very subtle) -->
        <radialGradient id="hg-brand" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stop-color="rgba(241,83,14,0.06)"/>
          <stop offset="60%"  stop-color="rgba(201,155,90,0.03)"/>
          <stop offset="100%" stop-color="transparent"/>
        </radialGradient>
        <!-- rim gradient: bright edge catch-light -->
        <radialGradient id="hg-rim" cx="50%" cy="50%" r="50%">
          <stop offset="80%"  stop-color="transparent"/>
          <stop offset="91%"  stop-color="rgba(255,255,255,0.18)"/>
          <stop offset="100%" stop-color="rgba(255,255,255,0.62)"/>
        </radialGradient>
        <!-- inner rim: glass thickness -->
        <radialGradient id="hg-rim-inner" cx="50%" cy="50%" r="50%">
          <stop offset="84%"  stop-color="transparent"/>
          <stop offset="93%"  stop-color="rgba(255,255,255,0.09)"/>
          <stop offset="100%" stop-color="rgba(255,255,255,0.18)"/>
        </radialGradient>
        <clipPath id="hg-clip"><circle cx="250" cy="250" r="228"/></clipPath>
      </defs>

      <!-- base body — slight translucency defines the sphere shape -->
      <circle cx="250" cy="250" r="228" fill="url(#hg-body)"/>
      <!-- brand tint -->
      <circle cx="250" cy="250" r="228" fill="url(#hg-brand)"/>
      <!-- depth shadow (lower-right darkening) -->
      <circle cx="250" cy="250" r="228" fill="url(#hg-depth)"/>
      <!-- large primary specular highlight (upper-left, the glass "window" reflection) -->
      <circle cx="250" cy="250" r="228" fill="url(#hg-spec1)"/>
      <!-- secondary highlight -->
      <ellipse cx="338" cy="158" rx="55" ry="44" fill="url(#hg-spec2)"/>
      <!-- caustic refraction spot -->
      <circle cx="250" cy="250" r="228" fill="url(#hg-caustic)"/>
      <!-- rim catch-light -->
      <circle cx="250" cy="250" r="228" fill="url(#hg-rim)"/>
      <!-- inner rim (glass thickness feel) -->
      <circle cx="250" cy="250" r="218" fill="url(#hg-rim-inner)"/>
      <!-- outer stroke — very subtle edge definition -->
      <circle cx="250" cy="250" r="230" fill="none" stroke="rgba(255,255,255,0.14)" stroke-width="1"/>
      <!-- tiny specular dot (pinpoint light source reflection) -->
      <circle cx="182" cy="142" r="9" fill="rgba(255,255,255,0.82)" filter="url(#hg-refract)"/>
    </svg>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const move = (e: MouseEvent) => {
    if (!el.value) return
    const cx = window.innerWidth / 2
    const cy = window.innerHeight / 2
    const dx = (e.clientX - cx) / cx
    const dy = (e.clientY - cy) / cy
    el.value.style.transform =
      `translate(calc(-50% + ${(dx * 18).toFixed(2)}px), calc(-50% + ${(dy * 12).toFixed(2)}px))`
  }
  window.addEventListener('mousemove', move, { passive: true })
  onBeforeUnmount(() => window.removeEventListener('mousemove', move))
})
</script>

<style scoped>
.hero-glass {
  position: absolute;
  width: clamp(320px, 52vmin, 680px);
  height: clamp(320px, 52vmin, 680px);
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 3;
  transition: transform 1.2s cubic-bezier(.25, .46, .45, .94);
  will-change: transform;
}
.hero-glass__halo {
  position: absolute;
  inset: -22%;
  border-radius: 50%;
  background: radial-gradient(circle at 42% 38%,
    rgba(255,255,255,0.12) 0%,
    rgba(241,83,14,0.06) 32%,
    transparent 65%);
  filter: blur(36px);
  animation: hgFloat 9s ease-in-out infinite alternate;
}
.hero-glass__svg {
  width: 100%;
  height: 100%;
  display: block;
  overflow: visible;
  animation: hgFloat 9s ease-in-out infinite alternate;
  filter: drop-shadow(0 0 60px rgba(255,255,255,0.10)) drop-shadow(0 24px 70px rgba(0,0,0,0.38));
}
@keyframes hgFloat {
  from { transform: translateY(0); }
  to   { transform: translateY(-24px); }
}
@media (prefers-reduced-motion: reduce) {
  .hero-glass__svg, .hero-glass__halo { animation: none; }
}
</style>
