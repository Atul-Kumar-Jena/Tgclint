<template>
  <div class="app-root">
    <div class="stage" aria-hidden="true"></div>
    <NuxtLayout>
      <NuxtPage :transition="pageTransition" />
    </NuxtLayout>
    <div v-show="loaderOn" ref="loaderEl" class="loader" aria-hidden="true">
      <div class="loader__brand"><Logo /><span>Saansud <em>Infra</em></span></div>
      <div class="loader__bar"><span ref="loaderBar" /></div>
    </div>
    <div class="grain" aria-hidden="true"></div>
  </div>
</template>

<script setup lang="ts">
useHead({ htmlAttrs: { lang: 'en' }, bodyAttrs: { class: 'fg' } })

const nuxtApp = useNuxtApp() as any
const route = useRoute()
const hold = usePageHold()
const loaderOn = ref(true)
const loaderEl = ref<HTMLElement | null>(null)
const loaderBar = ref<HTMLElement | null>(null)

const reduced = () => import.meta.client && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const scrollTop = () => {
  const l = nuxtApp.$lenis
  if (l) l.scrollTo(0, { immediate: true, force: true })
  window.scrollTo(0, 0)
}

/* ------------------------------------------------ first-load curtain */
onMounted(() => {
  const gsap = nuxtApp.$gsap
  const el = loaderEl.value
  if (!el || !gsap || reduced()) { loaderOn.value = false; hold.value = false; return }
  document.body.classList.add('is-booting')

  // page sits slightly pulled back under the curtain — rises and sharpens as it lifts
  const shell = document.querySelector('.page-shell') as HTMLElement | null
  if (shell) gsap.set(shell, { y: '2.5vh', scale: 0.95, filter: 'blur(6px)', transformOrigin: '50% 0%' })

  gsap.to(loaderBar.value, { scaleX: 1, duration: 1.15, ease: 'power2.inOut' })
  setTimeout(() => {
    gsap.timeline({
      onComplete: () => {
        loaderOn.value = false
        document.body.classList.remove('is-booting')
        // remove inline transform so GSAP ScrollTrigger pins measure clean layout
        if (shell) gsap.set(shell, { clearProps: 'all' })
      }
    })
      .to(el, { yPercent: -100, borderBottomLeftRadius: '34px', borderBottomRightRadius: '34px', duration: 1.05, ease: 'power4.inOut' }, 0)
      // page rises and sharpens in sync with the curtain lifting
      .to(shell, { y: 0, scale: 1, filter: 'blur(0px)', duration: 1.05, ease: 'expo.out' }, 0.05)
      // release the page reveals while the curtain is still lifting
      .call(() => { hold.value = false; document.body.classList.add('is-loaded') }, [], 0.34)
  }, 1250)
})

/* --------------------------------- stacked-card page transition (fluid.glass)
   The old page stays in place and dims; the new page slides up over it as a
   rounded card, then settles into normal flow. The scroll reset happens at the
   exact frame the card fully covers the viewport, so it is never visible. */
let enterTl: any = null
let leaveTween: any = null

const pageTransition = {
  css: false,
  onBeforeLeave: () => {
    hold.value = true
    const l = nuxtApp.$lenis
    if (l) l.stop()
  },
  onLeave: (el: Element, done: () => void) => {
    const gsap = nuxtApp.$gsap
    if (!gsap || reduced()) { done(); return }
    if (enterTl) enterTl.progress(1) // settle any in-flight enter first
    // old page recedes like a card being pushed aside — scale + blur + rounded corners
    leaveTween = gsap.to(el, {
      opacity: 0.45, scale: 0.88, y: '5vh', filter: 'blur(6px)', borderRadius: '28px',
      transformOrigin: '50% 0%', duration: 1.25, ease: 'power2.inOut', onComplete: done
    })
  },
  onEnter: (el: Element, done: () => void) => {
    const gsap = nuxtApp.$gsap
    if (!gsap || reduced()) { scrollTop(); done(); return }
    const vh = window.innerHeight
    gsap.set(el, {
      position: 'fixed', top: 0, left: 0, width: '100%', height: vh, overflow: 'hidden',
      zIndex: 6, y: vh, scale: 0.94, transformOrigin: '50% 0%',
      borderRadius: '34px 34px 0 0', boxShadow: '0 -36px 110px rgba(6,10,7,.62)',
      filter: 'blur(8px)'
    })
    enterTl = gsap.timeline({
      onComplete: () => {
        // swap happens under full cover: finish the old page, reset scroll, unfix
        if (leaveTween) { leaveTween.progress(1); leaveTween = null }
        scrollTop()
        gsap.set(el, { clearProps: 'all' })
        enterTl = null
        done()
      }
    })
      .to(el, { y: 0, duration: 1.1, ease: 'expo.inOut' }, 0)
      .to(el, { filter: 'blur(0px)', duration: 0.85, ease: 'power2.out' }, 0.1)
      .to(el, { scale: 1, duration: 0.95, ease: 'power3.inOut' }, 0.15)
      .to(el, { borderRadius: '0px 0px 0px 0px', duration: 0.4, ease: 'power2.out' }, 0.8)
  },
  onAfterEnter: () => {
    const l = nuxtApp.$lenis
    if (l) l.start()
    hold.value = false
    const ST = nuxtApp.$ScrollTrigger
    requestAnimationFrame(() => {
      if (ST) ST.refresh()
      if (route.hash) {
        const target = document.querySelector(route.hash)
        if (target) {
          if (l) l.scrollTo(target as HTMLElement, { offset: -24 })
          else (target as HTMLElement).scrollIntoView()
        }
      }
    })
  },
  onEnterCancelled: () => { if (enterTl) { enterTl.progress(1); enterTl = null } },
  onLeaveCancelled: () => { if (leaveTween) { leaveTween.progress(1); leaveTween = null } }
}
</script>
