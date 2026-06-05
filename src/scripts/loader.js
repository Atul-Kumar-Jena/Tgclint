/* loader: branded settle on the homepage, with hard fallback so it can never hang */
(function () {
  const FG = window.FG; if (!FG) return;

  function init() {
    const loader = document.querySelector('[data-loader]');
    if (!loader) {
      document.body.classList.add('is-loaded');
      FG.enter && FG.enter();
      FG.motion && FG.motion.revealHero();
      return;
    }

    FG.scroll && FG.scroll.lock();
    requestAnimationFrame(() => loader.classList.add('is-ready'));

    const bar = loader.querySelector('.loader__bar span');
    if (bar) {
      bar.style.transition = 'transform 1.05s cubic-bezier(.16,1,.3,1) .1s';
      requestAnimationFrame(() => { bar.style.transform = 'scaleX(1)'; });
    }

    let finished = false;
    function done() {
      if (finished) return; finished = true;
      document.body.classList.add('is-loaded');
      FG.enter && FG.enter();
      FG.motion && FG.motion.revealHero();
      FG.scroll && FG.scroll.unlock();
      setTimeout(() => { FG.scroll && FG.scroll.refresh(); }, 700);
    }
    function arm() { setTimeout(done, 850); }

    if (document.readyState === 'complete') arm();
    else window.addEventListener('load', arm, { once: true });
    setTimeout(done, 2600); // hard fallback
  }

  FG.loader = { init };
})();
