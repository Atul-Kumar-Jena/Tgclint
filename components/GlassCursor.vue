<template>
  <ClientOnly>
    <div ref="el" class="cursor"><span class="cursor__label">Explore</span></div>
  </ClientOnly>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
let raf = 0
let onMove: any, onLeave: any, onOver: any
onMounted(() => {
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return
  const node = el.value; if (!node) return
  document.documentElement.classList.add('has-glass-cursor')
  let x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y
  const EXPLORE = '[data-cursor="explore"]'
  const HOVER = 'a, button, .chip, label, [data-hover]'
  onMove = (e: MouseEvent) => { tx = e.clientX; ty = e.clientY; node.classList.add('is-active') }
  onLeave = () => node.classList.remove('is-active')
  onOver = (e: MouseEvent) => {
    const t = e.target as Element
    const ex = t && t.closest && t.closest(EXPLORE)
    const hv = !ex && t && t.closest && t.closest(HOVER)
    node.classList.toggle('is-explore', !!ex)
    node.classList.toggle('is-hover', !!hv)
  }
  window.addEventListener('mousemove', onMove, { passive: true })
  window.addEventListener('mouseleave', onLeave)
  document.addEventListener('mouseover', onOver)
  const tick = () => { x += (tx - x) * 0.16; y += (ty - y) * 0.16; node.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) translate(-50%,-50%)`; raf = requestAnimationFrame(tick) }
  tick()
})
onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  if (onMove) window.removeEventListener('mousemove', onMove)
  if (onLeave) window.removeEventListener('mouseleave', onLeave)
  if (onOver) document.removeEventListener('mouseover', onOver)
})
</script>
