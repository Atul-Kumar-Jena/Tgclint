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

      // Modern gallery side-scroll (Awwwards register): pinned scrub on desktop, native
      // swipe on touch. One refined language — the image parallaxes inside its frame like a
      // moving window, panels scale-recede from the centre with an organic vertical rhythm,
      // a deep atmosphere drifts behind, and the row skews into momentum on fast scrolls.
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

        // cache per-panel refs; inject a compositor-only veil; assign each image panel an
        // organic parallax depth + vertical lift so the gallery has rhythm, not a rigid grid
        const lifts = [0, 26, -20, 16, -12]
        let mediaIdx = 0
        const parts = panels.map((p) => {
          const media = p.querySelector('.hscroll__media') as HTMLElement | null
          const layer = p.querySelector('.hscroll__layer') as HTMLElement | null
          const cap = p.querySelector('.hscroll__cap') as HTMLElement | null
          let veil: HTMLElement | null = null
          let depth = 0, lift = 0
          if (media) {
            veil = media.querySelector('.hscroll__veil')
            if (!veil) { veil = document.createElement('div'); veil.className = 'hscroll__veil'; media.appendChild(veil) }
            depth = 12 + (mediaIdx % 3) * 3        // 12 / 15 / 18 % glide
            lift = lifts[mediaIdx % lifts.length]   // small vertical drift off-centre
            mediaIdx++
          }
          return { p, media, layer, cap, veil, depth, lift }
        })

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
            const k = Math.min(Math.abs(c), 1)   // 0 = centred, 1 = far edge
            const ec = Math.pow(k, 0.9)
            const part = parts[i]

            // scale-recede + organic vertical drift: centred panel is full size on the
            // baseline; neighbours shrink to ~0.86 and drift a touch up/down
            part.p.style.transform = `translate3d(0,${(part.lift * ec).toFixed(1)}px,0) scale(${(1 - ec * 0.14).toFixed(4)})`

            if (part.media) {
              // window parallax: the scene glides inside the frame as the panel crosses
              if (part.layer) part.layer.style.transform = `translate3d(${(-c * part.depth).toFixed(2)}%,0,0) scale(1.3)`
              // soft settle — image is ~88% open at the edges, fully open at centre (square)
              part.media.style.clipPath = `inset(0 ${(ec * 6).toFixed(1)}%)`
              // gentle veil lifts as the panel takes centre stage (opacity only → no repaint)
              if (part.veil) part.veil.style.opacity = (k * 0.42).toFixed(3)
            }

            // caption glides up and sharpens as the panel centres
            if (part.cap) {
              part.cap.style.opacity = Math.max(0, 1 - k * 1.1).toFixed(3)
              part.cap.style.transform = `translateY(${(k * 30).toFixed(1)}px)`
            }
          })
        }

        if (window.innerWidth > 1024) {
          const distance = () => Math.max(0, track.scrollWidth - window.innerWidth)
          // velocity-based skewX lean — the row tilts into fast scrubs, settles on release
          const lean = gsap.quickTo(track, 'skewX', { duration: 0.45, ease: 'power3.out' })
          gsap.to(track, {
            x: () => -distance(), ease: 'none',
            scrollTrigger: {
              trigger: hs, start: 'top top',
              // 1.3× pacing: the gallery advances more slowly and deliberately
              end: () => '+=' + (distance() * 1.3),
              scrub: 0.5, pin: true,
              invalidateOnRefresh: true,
              onUpdate: (self: any) => {
                feed(self.progress)
                lean(gsap.utils.clamp(-1.8, 1.8, self.getVelocity() / -1800))
                updatePanels()
                // deep backdrop creeps opposite the row for parallax depth
                if (atmos) atmos.style.transform = `translate3d(${(-self.progress * 6).toFixed(2)}%,0,0)`
              }
            }
          })
          updatePanels() // initial state
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
