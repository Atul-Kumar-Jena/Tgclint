// Real GSAP (+ ScrollTrigger) and Lenis smooth scroll, bridged on one ticker.
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

export default defineNuxtPlugin((nuxtApp) => {
  gsap.registerPlugin(ScrollTrigger)
  document.documentElement.classList.add('gsap')

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let lenis: Lenis | null = null

  if (!reduce) {
    lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 1, smoothWheel: true })
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time: number) => lenis!.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)
  }

  // scroll reset + refresh are handled by the page transition hooks in app.vue,
  // under the cover of the incoming card — never visibly.
  window.addEventListener('load', () => ScrollTrigger.refresh())

  // recompute pinned/scrubbed layouts once the viewport settles after a resize or
  // orientation change (debounced — refresh is expensive). Without this the pinned
  // side-scroll keeps a stale travel distance and the pin appears broken.
  let resizeT: ReturnType<typeof setTimeout> | undefined
  window.addEventListener('resize', () => {
    clearTimeout(resizeT)
    resizeT = setTimeout(() => ScrollTrigger.refresh(), 180)
  })

  return { provide: { gsap, ScrollTrigger, lenis } }
})
