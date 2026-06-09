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

  // after each route renders: jump to top, recalc triggers
  nuxtApp.hook('page:finish', () => {
    if (lenis) lenis.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)
    requestAnimationFrame(() => ScrollTrigger.refresh())
  })

  window.addEventListener('load', () => ScrollTrigger.refresh())

  return { provide: { gsap, ScrollTrigger, lenis } }
})
