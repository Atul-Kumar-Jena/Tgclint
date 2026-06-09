/* cookie: minimal consent bar persisted in localStorage */
(function () {
  const FG = window.FG; if (!FG) return;
  const KEY = 'fg-consent';

  function init() {
    const bar = document.querySelector('[data-cookie]'); if (!bar) return;
    let stored = null;
    try { stored = localStorage.getItem(KEY); } catch (_) { stored = 'skip'; }
    if (stored) return;

    bar.hidden = false;
    setTimeout(() => bar.setAttribute('data-show', ''), 1400);

    function choose(v) {
      try { localStorage.setItem(KEY, v); } catch (_) {}
      bar.removeAttribute('data-show');
      setTimeout(() => { bar.hidden = true; }, 500);
    }
    const yes = bar.querySelector('[data-cookie-accept]');
    const no = bar.querySelector('[data-cookie-deny]');
    yes && yes.addEventListener('click', () => choose('accepted'));
    no && no.addEventListener('click', () => choose('denied'));
  }

  FG.cookie = { init };
})();
