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
      // clear the transient card-clip/will-change right after the entrance completes
      setTimeout(() => document.body.classList.add('is-page-settled'), 1700);
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

    // "Where vision meets execution": pinned reveal — sketch holds, then the render rises + comes forward
    safe(() => {
      const pav = document.querySelector('[data-pavilion]');
      if (!pav || FG.reduce || !FG.motion) return;
      const svg = pav.querySelector('.pavilion');
      const line = pav.querySelector('.pavilion__line');
      const clipRect = pav.querySelector('#pvclip rect') || pav.querySelector('clipPath rect');
      const H = 640;
      if (clipRect) { clipRect.setAttribute('y', H); clipRect.setAttribute('height', 0); }
      FG.motion.registerScrub(pav, (prog, rect) => {
        const vh = window.innerHeight;
        const p = FG.clamp(-rect.top / ((rect.height - vh) || 1), 0, 1); // pinned progress
        const fill = FG.clamp((p - 0.28) / 0.5, 0, 1);                   // hold the sketch, then fill
        if (clipRect) { clipRect.setAttribute('y', ((1 - fill) * H).toFixed(1)); clipRect.setAttribute('height', (fill * H).toFixed(1)); }
        if (svg) svg.style.transform = 'scale(' + (1 + fill * 0.07).toFixed(4) + ')'; // colour comes forward
        if (line) line.style.opacity = (1 - fill * 0.22).toFixed(3);
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
