/* main: wire everything together, drive the page entrance, start the single rAF loop */
(function () {
  const FG = window.FG; if (!FG) return;

  function safe(fn) { try { fn && fn(); } catch (e) { console.error('[FG]', e); } }

  FG.ready(() => {
    document.documentElement.classList.add('js');

    // page entrance trigger (idempotent) — the whole surface stacks into existence
    let entered = false;
    FG.enter = function () {
      if (entered) return; entered = true;
      document.body.classList.add('is-entered');
      setTimeout(() => document.body.classList.add('is-page-settled'), 2200);
    };

    safe(() => FG.split && FG.split.init());
    safe(() => FG.motion && FG.motion.initReveal());
    safe(() => FG.motion && FG.motion.collect());

    const heroCanvas = document.querySelector('[data-hero-canvas]');
    safe(() => { if (heroCanvas && FG.hero) FG.hero.init(heroCanvas); });

    safe(() => FG.loader && FG.loader.init());        // triggers FG.enter on home as the loader clears
    safe(() => FG.nav && FG.nav.init());
    safe(() => FG.menuInit && FG.menuInit());
    safe(() => FG.quoteInit && FG.quoteInit());
    safe(() => FG.stories && FG.stories.init());
    safe(() => FG.hscroll && FG.hscroll.init());
    safe(() => FG.pillExpand && FG.pillExpand.init());
    safe(() => FG.cursor && FG.cursor.init());
    safe(() => FG.cookie && FG.cookie.init());

    // pavilion sketch -> colour reveal: fills early, gentle zoom settle, culled when offscreen
    safe(() => {
      const pav = document.querySelector('[data-pavilion]');
      if (!pav || FG.reduce || !FG.motion) return;
      const svg = pav.querySelector('.pavilion');
      const rect = pav.querySelector('#pvclip rect') || pav.querySelector('clipPath rect');
      const H = 640;
      if (rect) { rect.setAttribute('y', H); rect.setAttribute('height', 0); }
      FG.motion.registerScrub(pav, (prog) => {
        const p = FG.clamp((prog - 0.02) / 0.42, 0, 1);
        if (rect) { rect.setAttribute('y', ((1 - p) * H).toFixed(1)); rect.setAttribute('height', (p * H).toFixed(1)); }
        if (svg) svg.style.transform = 'scale(' + (1.05 - p * 0.05).toFixed(4) + ')';
      });
    });

    // inner pages have no loader: stack in after the first hidden frame paints
    if (!document.querySelector('[data-loader]')) requestAnimationFrame(() => requestAnimationFrame(FG.enter));
    setTimeout(FG.enter, 2800); // safety net so content can never stay hidden

    if (location.hash === '#quote' || location.search.indexOf('quote') > -1) {
      setTimeout(() => FG.quote && FG.quote.open(), 600);
    }

    window.addEventListener('load', () => {
      safe(() => FG.motion && FG.motion.collect());
      safe(() => FG.scroll && FG.scroll.refresh());
      safe(() => FG.hscroll && FG.hscroll.refresh());
    });

    FG.start();
  });
})();
