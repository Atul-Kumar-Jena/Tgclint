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
            part.p.style.transform = `scale(${(1 - k * 0.12).toFixed(4)})`
            if (part.media) {
              // focus depth: centred panel is tack sharp; off-centre panels go softly out-of-focus
              part.media.style.filter = `blur(${(k * 4).toFixed(1)}px)`
              // the unveiling — clip "doors" close dramatically as the frame leaves centre
              part.media.style.clipPath = `inset(0 ${Math.min(ec * 44, 54).toFixed(1)}% round 18px)`
              // cinematic push-in resolves as the frame reaches centre; layer parallaxes as a window
              if (part.layer) part.layer.style.transform = `translate3d(${(-c * 16).toFixed(2)}%,0,0) scale(${(1.38 - ec * 0.12).toFixed(3)})`
              // off-centre frames sink deeply into the dark — strong spotlight contrast
              if (part.veil) part.veil.style.opacity = (ec * 0.62).toFixed(3)
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
  }

  onBeforeUnmount(() => { disposed = true; if (ctx) ctx.revert() })
}
