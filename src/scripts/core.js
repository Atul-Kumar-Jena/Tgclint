/* core: shared namespace, utilities, single rAF loop */
window.FG = (function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  const ticks = [];
  let started = false, last = 0;

  function onTick(fn) { ticks.push(fn); return fn; }
  function offTick(fn) { const i = ticks.indexOf(fn); if (i > -1) ticks.splice(i, 1); }

  function loop(now) {
    const dt = last ? Math.min(now - last, 64) : 16;
    last = now;
    for (let i = 0; i < ticks.length; i++) {
      try { ticks[i](now, dt); } catch (e) { /* never let one bad tick kill the loop */ console.error(e); }
    }
    requestAnimationFrame(loop);
  }
  function start() { if (started) return; started = true; requestAnimationFrame(loop); }

  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const map = (v, a, b, c, d) => c + (d - c) * ((v - a) / (b - a));

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn, { once: true });
  }

  return { reduce, isTouch, onTick, offTick, start, clamp, lerp, map, ready };
})();
