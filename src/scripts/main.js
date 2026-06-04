/* main: wire everything together and start the single rAF loop */
(function () {
  const FG = window.FG; if (!FG) return;

  FG.ready(() => {
    // theme attribute for the document (nav/grain reference); per-section themes drive backgrounds
    document.documentElement.setAttribute('data-initial-theme', document.body.getAttribute('data-initial-theme') || 'light');

    FG.split && FG.split.init();
    FG.motion && FG.motion.initReveal();
    FG.motion && FG.motion.collect();

    const heroCanvas = document.querySelector('[data-hero-canvas]');
    if (heroCanvas && FG.hero) FG.hero.init(heroCanvas);

    FG.loader && FG.loader.init();
    FG.nav && FG.nav.init();
    FG.menuInit && FG.menuInit();
    FG.quoteInit && FG.quoteInit();
    FG.stories && FG.stories.init();
    FG.cursor && FG.cursor.init();
    FG.cookie && FG.cookie.init();

    // pavilion line-art -> fill reveal
    const pav = document.querySelector('[data-pavilion]');
    if (pav && FG.motion && !FG.reduce) {
      const rect = pav.querySelector('#pvclip rect') || pav.querySelector('clipPath rect');
      const H = 640;
      if (rect) { rect.setAttribute('y', H); rect.setAttribute('height', 0); }
      FG.motion.registerScrub(pav, (prog) => {
        const p = FG.clamp((prog - 0.1) / 0.5, 0, 1);
        if (rect) { rect.setAttribute('y', ((1 - p) * H).toFixed(1)); rect.setAttribute('height', (p * H).toFixed(1)); }
      });
    }

    // open quote / menu via hash or query (e.g. ?quote)
    if (location.hash === '#quote' || location.search.indexOf('quote') > -1) {
      setTimeout(() => FG.quote && FG.quote.open(), 400);
    }

    window.addEventListener('load', () => {
      FG.motion && FG.motion.collect();
      FG.scroll && FG.scroll.refresh();
    });

    FG.start();
  });
})();
