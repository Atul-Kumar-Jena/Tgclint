/* smooth-scroll: Lenis-style inertial wheel scrolling on the native scrollbar.
 * Touch + reduced-motion fall back to native scrolling. */
(function () {
  const FG = window.FG; if (!FG) return;

  const enabled = !FG.reduce && !FG.isTouch;
  let target = window.scrollY || 0;
  let current = target;
  let max = 0;
  let locked = false;
  let expected = -1;             // last position we wrote, to distinguish our writes from user input
  const EASE = 0.1;

  const maxScroll = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  function refresh() { max = maxScroll(); target = FG.clamp(target, 0, max); }
  refresh();

  function inScrollable(node) {
    return !!(node && node.closest && node.closest('.quote__content, .menu__panel, [data-native-scroll]'));
  }

  function onWheel(e) {
    if (!enabled || locked) return;       // overlay open -> let it scroll natively
    if (e.ctrlKey) return;                // pinch-zoom
    if (inScrollable(e.target)) return;
    e.preventDefault();
    const unit = e.deltaMode === 1 ? 24 : (e.deltaMode === 2 ? window.innerHeight : 1);
    target = FG.clamp(target + e.deltaY * unit, 0, max);
  }
  function onScroll() {
    const y = window.scrollY;
    if (!enabled) { current = target = y; return; }
    if (expected >= 0 && Math.abs(y - expected) <= 1.5) return; // our own programmatic write
    current = target = y;                 // external input (keyboard, scrollbar, find-in-page, anchor)
  }
  function tick() {
    if (!enabled || locked) return;
    current = FG.lerp(current, target, EASE);
    if (Math.abs(target - current) < 0.08) current = target;
    expected = Math.round(current);
    window.scrollTo(0, current);
  }
  function scrollTo(y, opts) {
    refresh();
    y = FG.clamp(y, 0, max);
    if (!enabled || (opts && opts.immediate)) { window.scrollTo(0, y); current = target = y; return; }
    target = y;
  }
  function lock() { locked = true; }
  function unlock() { locked = false; current = target = window.scrollY; }

  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', refresh);
  window.addEventListener('load', refresh);
  if ('ResizeObserver' in window) new ResizeObserver(refresh).observe(document.body);

  FG.onTick(tick);
  FG.scroll = { scrollTo, lock, unlock, refresh, enabled, get y() { return enabled ? current : window.scrollY; } };
})();
