/* end-of-page navigation: unfold the floating glass nav card as the footer approaches,
 * collapse it again on scroll up. Desktop only. */
(function () {
  const FG = window.FG; if (!FG) return;

  function init() {
    const endnav = document.querySelector('[data-endnav]');
    if (!endnav) return;
    let shown = false;

    function set(on) {
      if (on === shown) return;
      shown = on;
      endnav.classList.toggle('is-shown', on);
      endnav.setAttribute('aria-hidden', on ? 'false' : 'true');
    }
    function check() {
      if (FG.reduce || window.innerWidth <= 1024 || document.body.classList.contains('is-locked')) { set(false); return; }
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable < window.innerHeight * 0.5) { set(false); return; }
      const y = FG.scroll ? FG.scroll.y : window.scrollY;
      const remaining = scrollable - y;
      // unfold within the last ~screen of the page; collapse with hysteresis on the way up
      if (!shown && remaining < window.innerHeight * 0.9) set(true);
      else if (shown && remaining > window.innerHeight * 1.3) set(false);
    }
    FG.onTick(check);
  }

  FG.pillExpand = { init };
})();
