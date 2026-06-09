/* main: one-time setup + a re-runnable per-page init the router calls on every swap */
(function () {
  const FG = window.FG; if (!FG) return;
  function safe(fn) { try { fn && fn(); } catch (e) { console.error('[FG]', e); } }

  /* ---- page-scoped behaviour (runs on first load AND after every SPA swap) ---- */
  function pavilionInit() {
    const pav = document.querySelector('[data-pavilion]');
    if (!pav || FG.reduce || !FG.motion) return;
    const svg = pav.querySelector('.pavilion');
    const line = pav.querySelector('.pavilion__line');
    const clipRect = pav.querySelector('#pvclip rect') || pav.querySelector('clipPath rect');
    const H = 640;
    if (clipRect) { clipRect.setAttribute('y', H); clipRect.setAttribute('height', 0); }
    FG.motion.registerScrub(pav, (prog, rect) => {
      const vh = window.innerHeight;
      const p = FG.clamp(-rect.top / ((rect.height - vh) || 1), 0, 1);
      const fill = FG.clamp((p - 0.28) / 0.5, 0, 1);
      if (clipRect) { clipRect.setAttribute('y', ((1 - fill) * H).toFixed(1)); clipRect.setAttribute('height', (fill * H).toFixed(1)); }
      if (svg) svg.style.transform = 'scale(' + (0.93 + fill * 0.13).toFixed(4) + ')'; // sketch sits back, render comes forward
      if (line) line.style.opacity = (1 - fill * 0.25).toFixed(3);
    });
  }

  FG.page = {
    init() {
      safe(() => FG.split && FG.split.init());
      safe(() => FG.motion && FG.motion.initReveal());
      safe(() => FG.motion && FG.motion.collect());
      const heroCanvas = document.querySelector('[data-hero-canvas]');
      safe(() => { if (heroCanvas && FG.hero) FG._heroDestroy = FG.hero.init(heroCanvas); });
      safe(() => FG.stories && FG.stories.init());
      safe(() => FG.hscroll && FG.hscroll.init());
      safe(pavilionInit);
    },
    teardown() {
      safe(() => FG.motion && FG.motion.reset());
      safe(() => { if (FG._heroDestroy) { FG._heroDestroy(); FG._heroDestroy = null; } });
    }
  };

  FG.ready(() => {
    document.documentElement.classList.add('js');

    // first-load entrance (the whole surface stacks in)
    let entered = false;
    FG.enter = function () {
      if (entered) return; entered = true;
      document.body.classList.add('is-entered');
      setTimeout(() => document.body.classList.add('is-page-settled'), 1700);
    };

    // one-time chrome (persists across SPA navigations)
    safe(() => FG.nav && FG.nav.init());
    safe(() => FG.menuInit && FG.menuInit());
    safe(() => FG.quoteInit && FG.quoteInit());
    safe(() => FG.pillExpand && FG.pillExpand.init());
    safe(() => FG.cursor && FG.cursor.init());
    safe(() => FG.cookie && FG.cookie.init());

    // first page
    FG.page.init();
    safe(() => FG.loader && FG.loader.init());           // home: triggers FG.enter + revealHero as it clears

    // inner pages have no loader: stack in after a hidden frame paints
    if (!document.querySelector('[data-loader]')) requestAnimationFrame(() => requestAnimationFrame(FG.enter));
    setTimeout(FG.enter, 2800);                          // safety net

    if (location.hash === '#quote' || location.search.indexOf('quote') > -1) {
      setTimeout(() => FG.quote && FG.quote.open(), 600);
    }

    let rt;
    window.addEventListener('resize', () => {
      clearTimeout(rt);
      rt = setTimeout(() => {
        safe(() => FG.hscroll && FG.hscroll.refresh());
        safe(() => FG.motion && FG.motion.collect());
        safe(() => FG.scroll && FG.scroll.refresh());
      }, 150);
    });
    window.addEventListener('load', () => {
      safe(() => FG.motion && FG.motion.collect());
      safe(() => FG.scroll && FG.scroll.refresh());
      safe(() => FG.hscroll && FG.hscroll.refresh());
    });

    FG.start();
  });
})();
