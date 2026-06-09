/* nav: in-page anchor scrolling, hero scroll cue, and handing internal links to the router */
(function () {
  const FG = window.FG; if (!FG) return;

  function scrollToEl(el, offset) {
    if (!el) return;
    const y = el.getBoundingClientRect().top + (FG.scroll ? FG.scroll.y : window.scrollY) - (offset || 0);
    if (FG.scroll) FG.scroll.scrollTo(y);
    else window.scrollTo({ top: y, behavior: 'smooth' });
  }

  function init() {
    document.addEventListener('click', (e) => {
      // in-page anchor links
      const anchor = e.target.closest && e.target.closest('a[href^="#"]');
      if (anchor) {
        const id = anchor.getAttribute('href');
        if (id.length > 1) {
          const el = document.getElementById(id.slice(1)) || document.querySelector(id);
          if (el) { e.preventDefault(); scrollToEl(el, 12); return; }
        }
      }
      // hero scroll cue (delegated so it survives page swaps)
      const cue = e.target.closest && e.target.closest('[data-scroll-cue]');
      if (cue) { e.preventDefault(); scrollToEl(document.querySelector('[data-after-hero]'), 0); return; }

      // internal navigation -> SPA router (falls back to full load on any failure)
      const a = e.target.closest && e.target.closest('a[href]');
      if (!a || e.defaultPrevented) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      if (a.target === '_blank' || a.hasAttribute('download')) return;
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#')) return;
      let url; try { url = new URL(a.href, location.href); } catch (_) { return; }
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname) { if (url.hash) {/* same page anchor handled above */} return; }
      e.preventDefault();
      if (FG.router) FG.router.go(a.href);
      else { document.body.classList.add('is-leaving'); setTimeout(() => { location.href = a.href; }, 600); }
    });

    window.addEventListener('pageshow', (e) => { if (e.persisted) document.body.classList.remove('is-leaving'); });
  }

  FG.nav = { init, scrollToEl };
})();
