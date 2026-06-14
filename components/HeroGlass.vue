<template>
  <div class="hero-glass" aria-hidden="true" ref="el">
    <svg class="hero-glass__svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" overflow="visible">
      <defs>
        <filter id="hg-refract" x="-30%" y="-30%" width="160%" height="160%"
                color-interpolation-filters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.009"
                        numOctaves="4" seed="14" result="nz"/>
          <feDisplacementMap in="SourceGraphic" in2="nz"
                             scale="52" xChannelSelector="R" yChannelSelector="G" result="disp"/>
          <feGaussianBlur in="disp" stdDeviation="0.6" result="soft"/>
          <feColorMatrix in="soft" type="matrix"
            values="1.06 0 0 0 0  0 1.03 0 0 0  0 0 1.10 0 0  0 0 0 1 0"/>
        </filter>
        <radialGradient id="hg-shine" cx="36%" cy="28%" r="60%">
          <stop offset="0%"   stop-color="rgba(255,255,255,0.30)"/>
          <stop offset="38%"  stop-color="rgba(255,255,255,0.06)"/>
          <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
        </radialGradient>
        <radialGradient id="hg-depth" cx="64%" cy="72%" r="54%">
          <stop offset="0%"   stop-color="rgba(5,8,12,0.52)"/>
          <stop offset="100%" stop-color="transparent"/>
        </radialGradient>
        <radialGradient id="hg-rim" cx="50%" cy="50%" r="50%">
          <stop offset="78%"  stop-color="transparent"/>
          <stop offset="92%"  stop-color="rgba(255,255,255,0.06)"/>
          <stop offset="100%" stop-color="rgba(255,255,255,0.22)"/>
        </radialGradient>
        <radialGradient id="hg-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stop-color="rgba(241,83,14,0.04)"/>
          <stop offset="70%"  stop-color="rgba(201,169,110,0.03)"/>
          <stop offset="100%" stop-color="transparent"/>
        </radialGradient>
        <clipPath id="hg-clip">
          <circle cx="200" cy="200" r="188"/>
        </clipPath>
      </defs>

      <!-- refraction lens — applies displacement to what's rendered beneath -->
      <circle cx="200" cy="200" r="188"
              fill="rgba(255,255,255,0.03)"
              filter="url(#hg-refract)"/>
      <!-- subtle warm glow from brand orange -->
      <circle cx="200" cy="200" r="188" fill="url(#hg-glow)"/>
      <!-- depth shadow lower-right -->
      <circle cx="200" cy="200" r="188" fill="url(#hg-depth)"/>
      <!-- upper-left specular shine -->
      <circle cx="200" cy="200" r="188" fill="url(#hg-shine)"/>
      <!-- rim highlight -->
      <circle cx="200" cy="200" r="188" fill="url(#hg-rim)"/>
      <!-- outer stroke ring -->
      <circle cx="200" cy="200" r="190" fill="none"
              stroke="rgba(255,255,255,0.10)" stroke-width="0.8"/>
      <!-- inner fine ring for glass thickness feel -->
      <circle cx="200" cy="200" r="182" fill="none"
              stroke="rgba(255,255,255,0.04)" stroke-width="0.5"/>
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
      `translate(calc(-50% + ${(dx * 16).toFixed(2)}px), calc(-50% + ${(dy * 10).toFixed(2)}px))`
  }
  window.addEventListener('mousemove', move, { passive: true })
  onBeforeUnmount(() => window.removeEventListener('mousemove', move))
})
</script>

<style scoped>
.hero-glass {
  position: absolute;
  width: clamp(260px, 44vmin, 600px);
  height: clamp(260px, 44vmin, 600px);
  left: 50%;
  top: 44%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 3;
  animation: hgFloat 9s ease-in-out infinite alternate;
  transition: transform 1s cubic-bezier(.25, .46, .45, .94);
  will-change: transform;
}
.hero-glass__svg {
  width: 100%;
  height: 100%;
  display: block;
  overflow: visible;
}
@keyframes hgFloat {
  from { transform: translate(-50%, calc(-50% + 0px)); }
  to   { transform: translate(-50%, calc(-50% - 22px)); }
}
@media (prefers-reduced-motion: reduce) {
  .hero-glass { animation: none; }
}
</style>
