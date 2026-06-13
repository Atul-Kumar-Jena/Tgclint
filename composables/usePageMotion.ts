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
        gsap.fromTo(el, { autoAlpha: 0, y: 34, filter: 'blur(6px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 1.05, ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 88%' } })
      })
      gsap.utils.toArray('.card.reveal').forEach((el: any) => {
        gsap.fromTo(el, { autoAlpha: 0, y: 30, scale: 0.985, filter: 'blur(4px)' }, { autoAlpha: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.95, ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 92%' } })
      })
      gsap.utils.toArray('[data-split]').forEach((el: any) => {
        gsap.fromTo(el.querySelectorAll('.line > span'), { yPercent: 118 }, { yPercent: 0, duration: 1.15, ease: 'expo.out', stagger: 0.12,
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
        // the covered sheet physically recedes: dims and eases back in scale
        gsap.fromTo(sec, { opacity: 1, scale: 1 }, { opacity: 0.45, scale: 0.988, transformOrigin: '50% 0%', ease: 'none',
          scrollTrigger: { trigger: next, start: 'top 45%', end: 'top top', scrub: true } })
      })

      // fluid.glass horizontal narrative: pinned scrub on desktop, native swipe on touch.
      // Signature effect: each panel's media unfolds from a thin vertical strip to full
      // width as it approaches the viewport centre — clip-path inset collapses to zero.
      gsap.utils.toArray('[data-hscroll]').forEach((hs: any) => {
        const track = hs.querySelector('[data-hscroll-track]') as HTMLElement | null
        if (!track) return
        const counter = hs.querySelector('[data-hscroll-count]') as HTMLElement | null
        const bar = hs.querySelector('[data-hscroll-progress] span') as HTMLElement | null
        const panels = Array.from(track.querySelectorAll('.hscroll__panel')) as HTMLElement[]
        // exclude the end-panel from the counter total (same as fluid.glass)
        const projectCount = panels.filter(p => !p.classList.contains('hscroll__panel--end')).length || panels.length
        const pad = (v: number) => ('0' + v).slice(-2)

        const feed = (p: number) => {
          if (bar) bar.style.transform = `scaleX(${Math.max(0, Math.min(1, p)).toFixed(4)})`
          if (counter) {
            const cur = Math.min(projectCount, Math.floor(p * projectCount) + 1)
            counter.textContent = `${pad(cur)} / ${pad(projectCount)}`
          }
        }

        // Per-frame panel update: batch all getBoundingClientRect reads before any writes
        // to avoid layout thrashing. Runs inside the GSAP onUpdate (rAF-synced).
        const updatePanels = () => {
          const vw = window.innerWidth
          const rects = panels.map(p => p.getBoundingClientRect())
          rects.forEach((r, i) => {
            // c ∈ -1..1: signed distance of panel centre from viewport centre
            const c = (r.left + r.width / 2 - vw / 2) / vw
            const k = Math.min(Math.abs(c), 1) // 0 = fully centred, 1 = fully offscreen

            // THE fluid.glass signature: image opens from a thin strip to full frame
            const media = panels[i].querySelector('.hscroll__media') as HTMLElement | null
            if (media) media.style.clipPath = `inset(0 ${Math.min(k * 22, 46).toFixed(1)}% round 14px)`

            // layer drifts laterally for binocular depth (same formula as fluid.glass)
            const layer = panels[i].querySelector('.hscroll__layer') as HTMLElement | null
            if (layer) layer.style.transform = `translate3d(${(c * 5).toFixed(2)}%,0,0) scale(1.12)`

            // caption glides up and sharpens as the panel centres
            const cap = panels[i].querySelector('.hscroll__cap') as HTMLElement | null
            if (cap) {
              cap.style.opacity = (1 - k * 0.9).toFixed(3)
              cap.style.transform = `translateY(${(k * 22).toFixed(1)}px)`
            }

            // centre-focus: centred panel scales 2.2% larger than neighbours (fluid.glass feel)
            panels[i].style.transform = `scale(${(1 + (1 - k) * 0.022).toFixed(4)})`
          })
        }

        if (window.innerWidth > 1024) {
          const distance = () => Math.max(0, track.scrollWidth - window.innerWidth)
          // velocity-based skewX lean — the train tilts into fast scrubs, settles on release
          const lean = gsap.quickTo(track, 'skewX', { duration: 0.45, ease: 'power3.out' })
          gsap.to(track, {
            x: () => -distance(), ease: 'none',
            scrollTrigger: {
              trigger: hs, start: 'top top',
              // 1.3× pacing: the narrative advances more slowly and deliberately (fluid.glass)
              end: () => '+=' + (distance() * 1.3),
              scrub: 0.5, pin: true,
              invalidateOnRefresh: true,
              onUpdate: (self: any) => {
                feed(self.progress)
                lean(gsap.utils.clamp(-2.2, 2.2, self.getVelocity() / -1500))
                updatePanels()
              }
            }
          })
          updatePanels() // initial state — all panels start clipped
        } else {
          // mobile: native swipe, same counter + progress + clip feedback
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
