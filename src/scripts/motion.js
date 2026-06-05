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
      const amt = parseFloat(el.dataset.parallax) || (window.innerWidth < 768 ? 5 : 9);
      parallax.push({ el, wrap: el.parentElement, amt, cur: 0, seen: false });
    });
  }
  function registerScrub(el, fn) { if (el && !FG.reduce) scrubs.push({ el, fn }); }

  let speedScale = 0;
  function tick() {
    if (FG.reduce) return;
    const vh = window.innerHeight;
    // depth from scroll velocity: media breathes a hair when the page glides fast
    const vel = FG.scroll ? Math.abs(FG.scroll.velocity) : 0;
    speedScale = FG.lerp(speedScale, Math.min(vel * 0.0009, 0.035), 0.1);
    for (let i = 0; i < parallax.length; i++) {
      const p = parallax[i];
      const r = p.wrap.getBoundingClientRect();
      if (r.bottom < -240 || r.top > vh + 240) continue;
      const center = r.top + r.height / 2;
      const prog = (center - vh / 2) / (vh / 2 + r.height / 2); // -1 .. 1
      const targetY = -prog * p.amt;
      // ease the offset itself for a softer, less mechanical drift
      p.cur += (targetY - p.cur) * (p.seen ? 0.12 : 1);
      p.seen = true;
      p.el.style.transform = 'translate3d(0,' + p.cur.toFixed(3) + '%,0) scale(' + (1 + speedScale).toFixed(4) + ')';
    }
    for (let i = 0; i < scrubs.length; i++) {
      const s = scrubs[i];
      const r = s.el.getBoundingClientRect();
      const prog = FG.clamp((vh - r.top) / (r.height + vh), 0, 1);
      s.fn(prog, r);
    }
  }

  FG.onTick(tick);
  FG.motion = { initReveal, revealHero, collect, registerScrub, refresh: collect };
})();
