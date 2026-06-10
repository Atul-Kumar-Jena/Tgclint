<template>
  <canvas ref="cv" class="hero__canvas" aria-hidden="true" />
</template>

<script setup lang="ts">
const cv = ref<HTMLCanvasElement | null>(null)
let raf = 0, running = true, io: IntersectionObserver | null = null
let onResize: any
onMounted(() => {
  const canvas = cv.value; if (!canvas) return
  const ctx = canvas.getContext('2d', { alpha: false }); if (!ctx) return
  let w = 1, h = 1, dpr = 1
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const N = isTouch ? 5 : 7
  const palette = [[240, 104, 30], [86, 102, 160], [246, 138, 74], [70, 84, 140], [232, 168, 110], [120, 96, 88], [98, 114, 170]]
  const blobs = [] as any[]
  for (let i = 0; i < N; i++) blobs.push({ bx: Math.random(), by: Math.random(), r: 0.26 + Math.random() * 0.34, ph: Math.random() * Math.PI * 2, sp: 0.00013 + Math.random() * 0.0002, ax: 0.05 + Math.random() * 0.05, ay: 0.05 + Math.random() * 0.05, c: palette[i % palette.length] })
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.6)
    w = canvas!.clientWidth || window.innerWidth; h = canvas!.clientHeight || window.innerHeight
    canvas!.width = Math.max(1, Math.round(w * dpr)); canvas!.height = Math.max(1, Math.round(h * dpr))
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
  }
  function draw(now: number, dt: number) {
    const g = ctx!.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#0d101f'); g.addColorStop(0.6, '#131830'); g.addColorStop(1, '#1b2140')
    ctx!.globalCompositeOperation = 'source-over'; ctx!.fillStyle = g; ctx!.fillRect(0, 0, w, h)
    ctx!.globalCompositeOperation = 'lighter'
    for (const b of blobs) {
      b.ph += b.sp * (dt || 16)
      const x = (b.bx + Math.sin(b.ph) * b.ax) * w, y = (b.by + Math.cos(b.ph * 0.82) * b.ay) * h, rad = b.r * Math.max(w, h) * 0.8
      const rg = ctx!.createRadialGradient(x, y, 0, x, y, rad), c = b.c
      rg.addColorStop(0, `rgba(${c[0]},${c[1]},${c[2]},0.15)`); rg.addColorStop(0.5, `rgba(${c[0]},${c[1]},${c[2]},0.05)`); rg.addColorStop(1, `rgba(${c[0]},${c[1]},${c[2]},0)`)
      ctx!.fillStyle = rg; ctx!.beginPath(); ctx!.arc(x, y, rad, 0, Math.PI * 2); ctx!.fill()
    }
    ctx!.globalCompositeOperation = 'soft-light'
    for (let i = 0; i < 9; i++) { const x = (i / 9) * w + Math.sin(now * 0.00012 + i) * 16; ctx!.fillStyle = i % 2 ? 'rgba(255,255,255,0.018)' : 'rgba(0,0,0,0.03)'; ctx!.fillRect(x, 0, w / 9 * 0.5, h) }
  }
  resize(); onResize = resize; window.addEventListener('resize', resize)
  if (reduce) { draw(0, 0); return }
  let last = 0
  const loop = (t: number) => { const dt = last ? Math.min(t - last, 64) : 16; last = t; if (running) draw(t, dt); raf = requestAnimationFrame(loop) }
  raf = requestAnimationFrame(loop)
  io = new IntersectionObserver((es) => { running = es[0].isIntersecting }, { threshold: 0 }); io.observe(canvas)
})
onBeforeUnmount(() => { cancelAnimationFrame(raf); if (io) io.disconnect(); if (onResize) window.removeEventListener('resize', onResize) })
</script>
