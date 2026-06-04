/* nav: in-page anchor scrolling, hero scroll cue, soft page-transition cover */
(function () {
  const FG = window.FG; if (!FG) return;

  function scrollToEl(el, offset) {
    if (!el) return;
    const y = el.getBoundingClientRect().top + (FG.scroll ? FG.scroll.y : window.scrollY) - (offset || 0);
    if (FG.scroll) FG.scroll.scrollTo(y);
    else window.scrollTo({ top: y, behavior: 'smooth' });
  }

  function init() {
    // anchor links
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const el = document.getElementById(id.slice(1)) || document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      scrollToEl(el, 12);
    });

    // hero scroll cue
    const cue = document.querySelector('[data-scroll-cue]');
    if (cue) cue.addEventListener('click', () => scrollToEl(document.querySelector('[data-after-hero]'), 0));

    // soft page-transition cover for internal navigations
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href]');
      if (!a) return;
      if (e.defaultPrevented) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      if (a.target === '_blank' || a.hasAttribute('download')) return;
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#')) return;
      let url; try { url = new URL(a.href, location.href); } catch (_) { return; }
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname && url.hash) return;
      e.preventDefault();
      document.body.classList.add('is-leaving');
      setTimeout(() => { location.href = a.href; }, 430);
    });

    // restore cover state if navigated back via bfcache
    window.addEventListener('pageshow', (e) => { if (e.persisted) document.body.classList.remove('is-leaving'); });
  }

  FG.nav = { init, scrollToEl };
})();
