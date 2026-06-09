// GSAP/ScrollTrigger wiring for whatever page is currently mounted.
// Uses gsap.context() so everything reverts cleanly on route change.
export function usePageMotion() {
  const { $gsap, $ScrollTrigger } = useNuxtApp() as any
  let ctx: any

  onMounted(() => {
    const gsap = $gsap
    const ST = $ScrollTrigger
    if (!gsap) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // split [data-split] headings into masked lines (split on <br>)
    document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
      if (el.dataset.splitDone) return
      const parts = el.innerHTML.split(/<br\s*\/?>/i)
      el.innerHTML = parts.map((p) => `<span class="line"><span>${p}</span></span>`).join('')
      el.dataset.splitDone = '1'
    })
    if (reduce) return

    ctx = gsap.context(() => {
      gsap.utils.toArray('.reveal:not(.card)').forEach((el: any) => {
        gsap.fromTo(el, { autoAlpha: 0, y: 34 }, { autoAlpha: 1, y: 0, duration: 1.4, ease: 'power4.out',
          scrollTrigger: { trigger: el, start: 'top 88%' } })
      })
      gsap.utils.toArray('.card.reveal').forEach((el: any) => {
        gsap.fromTo(el, { autoAlpha: 0, y: 28, scale: 0.985 }, { autoAlpha: 1, y: 0, scale: 1, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 92%' } })
      })
      gsap.utils.toArray('[data-split]').forEach((el: any) => {
        gsap.fromTo(el.querySelectorAll('.line > span'), { yPercent: 118 }, { yPercent: 0, duration: 1.3, ease: 'expo.out', stagger: 0.12,
          scrollTrigger: { trigger: el, start: 'top 88%' } })
      })
      gsap.utils.toArray('[data-fade]').forEach((el: any) => {
        gsap.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.6, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 90%' } })
      })
      // media clip reveal via class toggle (CSS transitions clip-path reliably)
      gsap.utils.toArray('.clip-reveal').forEach((el: any) => {
        ST.create({ trigger: el, start: 'top 86%', once: true, onEnter: () => el.classList.add('is-in') })
      })
      // parallax media
      gsap.utils.toArray('[data-parallax]').forEach((el: any) => {
        const amt = parseFloat(el.dataset.parallax) || 12
        gsap.fromTo(el, { yPercent: -amt }, { yPercent: amt, ease: 'none',
          scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } })
      })

      // "Where vision meets execution": pinned sketch -> render comes forward
      const pav = document.querySelector('[data-pavilion]') as HTMLElement | null
      if (pav) {
        const fillRect = pav.querySelector('#pvclip rect') as SVGRectElement | null
        const svg = pav.querySelector('.pavilion') as SVGElement | null
        const line = pav.querySelector('.pavilion__line') as SVGElement | null
        const pin = pav.querySelector('.cta__pin') as HTMLElement | null
        if (fillRect) { fillRect.setAttribute('y', '640'); fillRect.setAttribute('height', '0') }
        void pin // pin is handled by CSS sticky on .cta__pin
        ST.create({
          trigger: pav, start: 'top top', end: 'bottom bottom', scrub: true,
          onUpdate: (self: any) => {
            const fill = gsap.utils.clamp(0, 1, (self.progress - 0.28) / 0.5)
            if (fillRect) { fillRect.setAttribute('y', String(((1 - fill) * 640).toFixed(1))); fillRect.setAttribute('height', String((fill * 640).toFixed(1))) }
            if (svg) svg.style.transform = `scale(${(0.93 + fill * 0.13).toFixed(4)})`
            if (line) (line as any).style.opacity = String((1 - fill * 0.25).toFixed(3))
          }
        })
      }

      // horizontal project narrative (pinned)
      const hs = document.querySelector('[data-hscroll]') as HTMLElement | null
      const track = hs && (hs.querySelector('[data-hscroll-track]') as HTMLElement | null)
      if (hs && track && window.innerWidth > 1024) {
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth)
        gsap.to(track, {
          x: () => -distance(), ease: 'none',
          scrollTrigger: { trigger: hs, start: 'top top', end: () => '+=' + distance(), scrub: 1, pin: true, invalidateOnRefresh: true }
        })
      }
    })

    ST.refresh()
  })

  onBeforeUnmount(() => { if (ctx) ctx.revert() })
}
