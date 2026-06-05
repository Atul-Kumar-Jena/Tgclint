/* pill-expand: near the end of the page the floating nav expands into a navigation
 * "story ending"; collapses back to the compact pill when scrolling up. Desktop only. */
(function () {
  const FG = window.FG; if (!FG) return;

  function init() {
    const pill = document.querySelector('[data-pill]');
    const nav = pill && pill.querySelector('[data-pill-nav]');
    if (!pill || !nav) return;

    let expanded = false;
    function setExpanded(on) {
      if (on === expanded) return;
      expanded = on;
      pill.classList.toggle('is-expanded', on);
      nav.setAttribute('aria-hidden', on ? 'false' : 'true');
    }

    function check() {
      // disabled on small screens / reduced motion / while an overlay is open
      if (FG.reduce || window.innerWidth <= 1024 || document.body.classList.contains('is-locked')) {
        setExpanded(false); return;
      }
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable < window.innerHeight * 0.6) { setExpanded(false); return; }
      const y = FG.scroll ? FG.scroll.y : window.scrollY;
      const remaining = scrollable - y;
      // expand within the last ~13% of the page, with hysteresis to avoid flicker
      if (!expanded && remaining < window.innerHeight * 0.85) setExpanded(true);
      else if (expanded && remaining > window.innerHeight * 1.15) setExpanded(false);
    }

    FG.onTick(check);
  }

  FG.pillExpand = { init };
})();
