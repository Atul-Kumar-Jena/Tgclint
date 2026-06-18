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
      // Reveal helper. Elements already inside the viewport when the page boots reveal
      // IMMEDIATELY (a load entrance); anything below the fold keeps a scroll-triggered reveal.
      // Above-the-fold reveals must not depend on scroll-position maths that can be thrown off
      // by the loader curtain / page transition still settling.
      const vh = window.innerHeight
      const inView = (el: any) => el.getBoundingClientRect().top < vh * 0.92
      const reveal = (el: any, target: any, from: any, to: any, start: string, stagger = 0) => {
        const vars = stagger ? { ...to, stagger } : { ...to }
        if (inView(el)) gsap.fromTo(target, from, { ...vars, delay: 0.12 })
        else gsap.fromTo(target, from, { ...vars, scrollTrigger: { trigger: el, start } })
      }
      gsap.utils.toArray('.reveal:not(.card)').forEach((el: any) =>
        reveal(el, el, { autoAlpha: 0, y: 28, filter: 'blur(5px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.78, ease: 'expo.out' }, 'top 90%'))
      gsap.utils.toArray('.card.reveal').forEach((el: any) =>
        reveal(el, el, { autoAlpha: 0, y: 26, scale: 0.99, filter: 'blur(3px)' }, { autoAlpha: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.68, ease: 'expo.out' }, 'top 94%'))
      gsap.utils.toArray('[data-fade]').forEach((el: any) =>
        reveal(el, el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.85, ease: 'power2.out' }, 'top 92%'))
      // Split-heading + clip reveals are class-driven (CSS transition), the reliable mechanism
      // that doesn't depend on the GSAP ticker/context being settled at boot. In view → reveal
      // on the next frame; below the fold → reveal once it scrolls into view.
      const classReveal = (sel: string, start: string) => gsap.utils.toArray(sel).forEach((el: any) => {
        if (inView(el)) requestAnimationFrame(() => el.classList.add('is-in'))
        else ST.create({ trigger: el, start, once: true, onEnter: () => el.classList.add('is-in') })
      })
      classReveal('[data-split]', 'top 88%')
      classReveal('.clip-reveal', 'top 86%')
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
        // the covered sheet physically recedes: dims and eases back in scale (fluid.glass cinematic depth)
        gsap.fromTo(sec, { opacity: 1, scale: 1 }, { opacity: 0.28, scale: 0.976, transformOrigin: '50% 0%', ease: 'none',
          scrollTrigger: { trigger: next, start: 'top 45%', end: 'top top', scrub: true } })
      })

      // Modern gallery side-scroll (fluid.glass register): a pinned horizontal pin-scrub on
      // desktop, native swipe on touch. One clean language — each frame UNVEILS via a clip-path
      // "door" as it nears the centre, the scene parallaxes inside its frame like a moving window,
      // and off-centre frames dim + recede. No skew and no per-frame layout reads: panel positions
      // are derived from the live track offset, so the reveal stays exact at any scroll speed.
      gsap.utils.toArray('[data-hscroll]').forEach((hs: any) => {
        const track = hs.querySelector('[data-hscroll-track]') as HTMLElement | null
        if (!track) return
        const counter = hs.querySelector('[data-hscroll-count]') as HTMLElement | null
        const bar = hs.querySelector('[data-hscroll-progress] span') as HTMLElement | null
        const panels = Array.from(track.querySelectorAll('.hscroll__panel')) as HTMLElement[]
        // exclude the end-panel from the counter total
        const projectCount = panels.filter(p => !p.classList.contains('hscroll__panel--end')).length || panels.length
        const pad = (v: number) => ('0' + v).slice(-2)

        // deep atmospheric backdrop behind the panels (injected once, no template edits)
        const sticky = hs.querySelector('.hscroll__sticky') as HTMLElement | null
        let atmos: HTMLElement | null = sticky ? sticky.querySelector('.hscroll__atmos') : null
        if (sticky && !atmos) {
          atmos = document.createElement('div'); atmos.className = 'hscroll__atmos'
          sticky.insertBefore(atmos, sticky.firstChild)
        }

        // cache per-panel refs; inject a compositor-only dimming veil into each image frame
        const parts = panels.map((p) => {
          const media = p.querySelector('.hscroll__media') as HTMLElement | null
          const layer = p.querySelector('.hscroll__layer') as HTMLElement | null
          const cap = p.querySelector('.hscroll__cap') as HTMLElement | null
          let veil: HTMLElement | null = null
          if (media) {
            veil = media.querySelector('.hscroll__veil')
            if (!veil) { veil = document.createElement('div'); veil.className = 'hscroll__veil'; media.appendChild(veil) }
          }
          return { p, media, layer, cap, veil, isEnd: p.classList.contains('hscroll__panel--end') }
        })

        let lastCur = -1
        const feed = (p: number) => {
          if (bar) bar.style.transform = `scaleX(${Math.max(0, Math.min(1, p)).toFixed(4)})`
          if (counter) {
            const cur = Math.min(projectCount, Math.floor(p * projectCount) + 1)
            if (cur !== lastCur) { counter.textContent = `${pad(cur)} / ${pad(projectCount)}`; lastCur = cur }
          }
        }

        // Layout measured once per refresh (transforms don't affect offsetLeft/offsetWidth), so
        // the per-frame work is pure maths with zero layout thrash. The track travels from the
        // FIRST panel dead-centre to the LAST panel dead-centre, so every frame passes through
        // the centre and earns its full-open moment (centre-to-centre, not edge-to-edge).
        let vw = window.innerWidth
        let startX = 0     // track x that places the first panel dead-centre
        let distance = 0   // total horizontal travel: centre of first → centre of last
        let bases: number[] = []
        const measure = () => {
          vw = window.innerWidth
          bases = parts.map(part => part.p.offsetLeft + part.p.offsetWidth / 2)
          startX = vw / 2 - bases[0]
          distance = bases[bases.length - 1] - bases[0]
        }

        // Per frame: a panel's on-screen centre = its layout centre + the live track offset.
        // |c| runs 0 (dead-centre) → 1 (a viewport away) and drives the whole reveal. Scaling is
        // about the panel centre, so the centre stays fixed and the offset maths stays exact.
        const render = (p: number) => {
          const trackX = startX - distance * p
          for (let i = 0; i < parts.length; i++) {
            const part = parts[i]
            const c = (bases[i] + trackX - vw / 2) / vw
            const k = Math.min(Math.abs(c), 1)
            const ec = Math.pow(k, 0.82)
            // end card reads as a clean CTA destination — no clip or blur theatrics
            if (part.isEnd) {
              part.p.style.transform = `scale(${(1 - k * 0.04).toFixed(4)})`
              if (part.veil) part.veil.style.opacity = (ec * 0.32).toFixed(3)
              continue
            }
            part.p.style.transform = `scale(${(1 - k * 0.13).toFixed(4)})`
            if (part.media) {
              // focus depth: centred panel is tack sharp; off-centre panels go softly out-of-focus
              part.media.style.filter = `blur(${(k * 3.4).toFixed(1)}px)`
              // Asymmetric "door": the clip closes only on the OUTER edge (the side facing away
              // from centre), so the inner edge always reaches toward the middle. This unveils a
              // frame as it arrives and seals it away as it leaves — without ever emptying the
              // centre during a hand-off (a symmetric clip eats the inner edge and leaves a void).
              const outer = (ec * 42).toFixed(1)
              part.media.style.clipPath = c < 0
                ? `inset(0 0 0 ${outer}% round 16px)`
                : `inset(0 ${outer}% 0 0 round 16px)`
              // Crisp at centre, gentle overscan toward the edges. The layer is the moving "window":
              // minimal scale at centre keeps the hero sharp; more scale off-centre gives the
              // parallax translate headroom (paired with the -14% inset so no edge is ever revealed).
              if (part.layer) part.layer.style.transform = `translate3d(${(-c * 12).toFixed(2)}%,0,0) scale(${(1.05 + ec * 0.14).toFixed(3)})`
              // off-centre frames sink deeply into the dark — strong spotlight contrast
              if (part.veil) part.veil.style.opacity = (ec * 0.58).toFixed(3)
            }
            // caption sharpens (blur lifts) and rises as the panel nears centre
            if (part.cap) {
              part.cap.style.opacity = Math.max(0, 1 - k * 1.15).toFixed(3)
              part.cap.style.transform = `translate3d(0,${(k * 26).toFixed(1)}px,0)`
              part.cap.style.filter = `blur(${(k * 5).toFixed(1)}px)`
            }
          }
        }

        if (window.innerWidth > 1024) {
          measure()
          gsap.fromTo(track,
            { x: () => startX },
            {
              x: () => startX - distance, ease: 'none',
              scrollTrigger: {
                trigger: hs, start: 'top top',
                // 1.1× pacing: the gallery advances deliberately, giving each reveal room to breathe
                end: () => '+=' + (distance * 1.15),
                scrub: 0.35, pin: true, anticipatePin: 1,
                invalidateOnRefresh: true,
                onRefresh: measure,
                onUpdate: (self: any) => {
                  feed(self.progress)
                  render(self.progress)
                  // deep backdrop creeps opposite the row for parallax depth
                  if (atmos) atmos.style.transform = `translate3d(${(-self.progress * 8).toFixed(2)}%,0,0)`
                }
              }
            })
          render(0) // initial state
        } else {
          // mobile: native swipe, same counter + progress + clip feedback
          const vp = hs.querySelector('.hscroll__viewport') as HTMLElement | null
          if (vp) {
            // swipe affordance: tell the user the gallery scrolls sideways; it fades the
            // moment they start swiping (injected here so no template edits are needed)
            let hint: HTMLElement | null = sticky ? sticky.querySelector('.hscroll__hint') : null
            if (sticky && !hint) {
              hint = document.createElement('div')
              hint.className = 'hscroll__hint'
              hint.innerHTML = '<span>Swipe to explore</span><i class="hscroll__arrows" aria-hidden="true"><b></b><b></b><b></b></i>'
              sticky.appendChild(hint)
            }
            let raf = 0
            let hinted = false
            vp.addEventListener('scroll', () => {
              if (!hinted && hint && vp.scrollLeft > 6) { hinted = true; hint.classList.add('is-gone') }
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

    // Safety net — after a page transition the first reveal measurement can land
    // while the incoming card is still settling, leaving above-the-fold story beats
    // (notably the split hero heading) stuck in their hidden state. Re-assert every
    // in-view reveal on the next frames and once more after the card lands, so the
    // new page always arrives fully composed (idempotent: only touches still-hidden,
    // in-view elements).
    const settleReveals = () => {
      if (disposed) return
      const vh2 = window.innerHeight
      const within = (el: HTMLElement) => el.getBoundingClientRect().top < vh2 * 0.95
      document.querySelectorAll<HTMLElement>('[data-split], .clip-reveal').forEach((el) => {
        if (!el.classList.contains('is-in') && within(el)) el.classList.add('is-in')
      })
      gsap.utils.toArray('.reveal:not(.card), .card.reveal, [data-fade]').forEach((el: any) => {
        if (within(el) && parseFloat(getComputedStyle(el).opacity) < 0.02) {
          gsap.to(el, { autoAlpha: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.72, ease: 'expo.out' })
        }
      })
    }
    requestAnimationFrame(() => requestAnimationFrame(settleReveals))
    gsap.delayedCall(0.3, settleReveals)
  }

  onBeforeUnmount(() => { disposed = true; if (ctx) ctx.revert() })
}
