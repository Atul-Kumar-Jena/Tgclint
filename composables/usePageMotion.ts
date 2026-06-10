// GSAP/ScrollTrigger wiring for whatever page is currently mounted.
// Uses gsap.context() so everything reverts cleanly on route change.
export function usePageMotion() {
  const { $gsap, $ScrollTrigger } = useNuxtApp() as any
  let ctx: any
  let disposed = false

  onMounted(() => {
    const gsap = $gsap
    const ST = $ScrollTrigger
    if (!gsap) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // split [data-split] headings into masked lines (split on <br>) — done at mount,
    // pre-paint, so the html.js hidden state applies before anything is visible
    document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
      if (el.dataset.splitDone) return
      const parts = el.innerHTML.split(/<br\s*\/?>/i)
      el.innerHTML = parts.map((p) => `<span class="line"><span>${p}</span></span>`).join('')
      el.dataset.splitDone = '1'
    })
    if (reduce) return

    // wait until the page is fully on stage (curtain lifted / card settled):
    // triggers then measure the real layout and above-the-fold reveals play in sync
    const hold = usePageHold()
    if (!hold.value) boot(gsap, ST)
    else {
      const un = watch(hold, (v) => { if (!v) { un(); if (!disposed) boot(gsap, ST) } })
    }
  })

  function boot(gsap: any, ST: any) {
    ctx = gsap.context(() => {
      gsap.utils.toArray('.reveal:not(.card)').forEach((el: any) => {
        gsap.fromTo(el, { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 1.2, ease: 'power4.out',
          scrollTrigger: { trigger: el, start: 'top 88%' } })
      })
      gsap.utils.toArray('.card.reveal').forEach((el: any) => {
        gsap.fromTo(el, { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 1.1, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 92%' } })
      })
      gsap.utils.toArray('[data-split]').forEach((el: any) => {
        gsap.fromTo(el.querySelectorAll('.line > span'), { yPercent: 118 }, { yPercent: 0, duration: 1.25, ease: 'expo.out', stagger: 0.1,
          scrollTrigger: { trigger: el, start: 'top 88%' } })
      })
      gsap.utils.toArray('[data-fade]').forEach((el: any) => {
        gsap.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.2, ease: 'power2.out',
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

      // scroll deck: as the next sheet slides over, the covered section recedes —
      // its content drifts up slower and the sheet dims, revealing true layering.
      // Sections with their own pinned/sticky internals are left untouched.
      const sheets = gsap.utils.toArray('.page-shell section[data-theme]') as HTMLElement[]
      sheets.forEach((sec, i) => {
        const next = sheets[i + 1]
        if (!next) return
        if (sec.matches('.hero, .page-hero, .project-hero, [data-hscroll], .stories, .cta')) return
        const inner = sec.querySelector(':scope > .container')
        if (inner) {
          gsap.fromTo(inner, { y: 0 }, { y: -56, ease: 'none',
            scrollTrigger: { trigger: next, start: 'top bottom', end: 'top top', scrub: true } })
        }
        gsap.fromTo(sec, { opacity: 1 }, { opacity: 0.5, ease: 'none',
          scrollTrigger: { trigger: next, start: 'top 45%', end: 'top top', scrub: true } })
      })

      // horizontal narratives (pinned scrub on desktop, native swipe on touch):
      // live counter, hairline progress, in-frame parallax and soft entrances
      gsap.utils.toArray('[data-hscroll]').forEach((hs: any) => {
        const track = hs.querySelector('[data-hscroll-track]') as HTMLElement | null
        if (!track) return
        const counter = hs.querySelector('[data-hscroll-count]') as HTMLElement | null
        const bar = hs.querySelector('[data-hscroll-progress] span') as HTMLElement | null
        const panels = Array.from(track.querySelectorAll('.hscroll__panel')) as HTMLElement[]
        const n = panels.length
        const feed = (p: number) => {
          if (bar) bar.style.transform = `scaleX(${Math.max(0, Math.min(1, p)).toFixed(4)})`
          if (counter && n) {
            const idx = Math.max(1, Math.min(n, Math.round(p * (n - 1)) + 1))
            counter.textContent = `0${idx} / 0${n}`
          }
        }
        if (window.innerWidth > 1024) {
          const distance = () => Math.max(0, track.scrollWidth - window.innerWidth)
          const tween = gsap.to(track, {
            x: () => -distance(), ease: 'none',
            scrollTrigger: {
              trigger: hs, start: 'top top', end: () => '+=' + distance(), scrub: 1, pin: true,
              invalidateOnRefresh: true, onUpdate: (self: any) => feed(self.progress)
            }
          })
          panels.forEach((panel) => {
            // media drifts inside its frame as the train passes — quiet depth
            const layer = panel.querySelector('.hscroll__layer')
            if (layer) {
              gsap.fromTo(layer, { xPercent: -5 }, { xPercent: 5, ease: 'none',
                scrollTrigger: { trigger: panel, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } })
            }
            // each panel settles in as it enters from the right edge
            gsap.fromTo(panel, { y: 36, opacity: 0.25 }, { y: 0, opacity: 1, ease: 'power2.out', duration: 0.8,
              scrollTrigger: { trigger: panel, containerAnimation: tween, start: 'left 96%', end: 'left 62%', scrub: true } })
          })
        } else {
          // native horizontal swipe: same counter + progress feedback on mobile
          const vp = hs.querySelector('.hscroll__viewport') as HTMLElement | null
          if (vp) {
            let raf = 0
            vp.addEventListener('scroll', () => {
              if (raf) return
              raf = requestAnimationFrame(() => {
                raf = 0
                const max = vp.scrollWidth - vp.clientWidth
                if (max > 0) feed(vp.scrollLeft / max)
              })
            }, { passive: true })
          }
        }
      })
    })

    ST.refresh()
  }

  onBeforeUnmount(() => { disposed = true; if (ctx) ctx.revert() })
}
