/* menu: centered glass overlay with focus handling */
(function () {
  const FG = window.FG; if (!FG) return;

  function init() {
    const menu = document.getElementById('menu'); if (!menu) return;
    const panel = menu.querySelector('.menu__panel');
    const openers = document.querySelectorAll('[data-menu-open]');
    const closers = menu.querySelectorAll('[data-menu-close]');
    const pill = document.querySelector('[data-pill]');
    let lastFocus = null;

    function open() {
      lastFocus = document.activeElement;
      menu.setAttribute('aria-hidden', 'false');
      document.body.classList.add('is-locked');
      FG.scroll && FG.scroll.lock();
      openers.forEach((o) => o.setAttribute('aria-expanded', 'true'));
      pill && pill.classList.add('pill--hidden');
      setTimeout(() => panel && panel.focus(), 60);
    }
    function close() {
      if (menu.getAttribute('aria-hidden') === 'true') return;
      menu.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('is-locked');
      FG.scroll && FG.scroll.unlock();
      openers.forEach((o) => o.setAttribute('aria-expanded', 'false'));
      pill && pill.classList.remove('pill--hidden');
      lastFocus && lastFocus.focus && lastFocus.focus();
    }

    openers.forEach((o) => o.addEventListener('click', open));
    closers.forEach((c) => c.addEventListener('click', close));
    menu.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { close(); return; }
      if (e.key === 'Tab') { // simple focus trap
        const f = menu.querySelectorAll('a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])');
        if (!f.length) return;
        const first = f[0], lastEl = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); lastEl.focus(); }
        else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); first.focus(); }
      }
    });
    // links navigate, so close (transition cover handles the rest)
    menu.querySelectorAll('.menu__link, .menu__sub').forEach((l) => l.addEventListener('click', close));

    FG.menu = { open, close };
  }

  FG.menuInit = init;
})();
