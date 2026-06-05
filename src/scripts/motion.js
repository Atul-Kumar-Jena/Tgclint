/* motion: reveal-on-enter (IntersectionObserver) + per-frame parallax & scrub */
(function () {
  const FG = window.FG; if (!FG) return;

  function initReveal() {
    const all = Array.prototype.slice.call(document.querySelectorAll('.reveal, [data-split], [data-fade], .clip-reveal'));
    if (FG.reduce || !('IntersectionObserver' in window)) {
      all.forEach((el) => el.classList.add('is-in'));
      return;
    }
    // hero elements are revealed by the loader once it clears (so they aren't hidden behind it)
    const observed = all.filter((el) => !el.closest('.hero'));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        el.classList.add('is-in');
        io.unobserve(el);
        setTimeout(() => el.classList.add('is-settled'), 1900); // free will-change
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
    observed.forEach((el) => io.observe(el));
  }
  function revealHero() {
    document.querySelectorAll('.hero .reveal, .hero [data-split], .hero [data-fade], .hero .clip-reveal')
      .forEach((el) => { el.classList.add('is-in'); setTimeout(() => el.classList.add('is-settled'), 2200); });
  }

  const parallax = [];
  const scrubs = [];

  function collect() {
    parallax.length = 0;
    if (FG.reduce) return;
    document.querySelectorAll('[data-parallax]').forEach((el) => {
      const amt = parseFloat(el.dataset.parallax) || (window.innerWidth < 768 ? 6 : 11);
      parallax.push({ el, wrap: el.parentElement, amt, cur: 0, seen: false });
    });
  }
  function registerScrub(el, fn) { if (el && !FG.reduce) scrubs.push({ el, fn }); }

  function tick() {
    if (FG.reduce) return;
    const vh = window.innerHeight;
    for (let i = 0; i < parallax.length; i++) {
      const p = parallax[i];
      const r = p.wrap.getBoundingClientRect();
      if (r.bottom < -120 || r.top > vh + 120) continue;       // cull offscreen
      const center = r.top + r.height / 2;
      const prog = (center - vh / 2) / (vh / 2 + r.height / 2); // -1 .. 1
      const targetY = -prog * p.amt;
      p.cur += (targetY - p.cur) * (p.seen ? 0.18 : 1);        // light smoothing, responsive
      p.seen = true;
      p.el.style.transform = 'translate3d(0,' + p.cur.toFixed(3) + '%,0)';
    }
    for (let i = 0; i < scrubs.length; i++) {
      const s = scrubs[i];
      const r = s.el.getBoundingClientRect();
      if (r.bottom < -80 || r.top > vh + 80) continue;          // cull offscreen scrubs (perf)
      const prog = FG.clamp((vh - r.top) / (r.height + vh), 0, 1);
      s.fn(prog, r);
    }
  }

  FG.onTick(tick);
  FG.motion = { initReveal, revealHero, collect, registerScrub, refresh: collect };
})();
