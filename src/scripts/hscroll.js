/* hscroll: pinned horizontal project narrative on desktop; native swipe gallery otherwise */
(function () {
  const FG = window.FG; if (!FG) return;

  let root, track, count, panels, projectCount, distance = 0;

  function canPin() {
    return !FG.reduce && FG.scroll && FG.scroll.enabled && window.innerWidth > 1024;
  }

  function layout() {
    if (!root || !track) return;
    if (!canPin()) {
      root.classList.remove('is-pinned');
      root.style.height = '';
      track.style.transform = '';
      if (panels) panels.forEach((p) => {
        const l = p.querySelector('[data-hpara]'); if (l) l.style.transform = '';
        const m = p.querySelector('.hscroll__meta'); if (m) { m.style.opacity = ''; m.style.transform = ''; }
      });
      distance = 0;
      return;
    }
    root.classList.add('is-pinned');
    track.style.transform = 'translate3d(0,0,0)';
    distance = Math.max(0, track.scrollWidth - window.innerWidth);
    // 1.3x pacing -> the horizontal narrative advances more slowly and deliberately
    root.style.height = (window.innerHeight + distance * 1.3) + 'px';
  }

  function init() {
    root = document.querySelector('[data-hscroll]');
    if (!root) return;
    track = root.querySelector('[data-hscroll-track]');
    count = root.querySelector('[data-hscroll-count]');
    if (!track) return;
    panels = Array.prototype.slice.call(track.children);
    projectCount = panels.filter((p) => !p.classList.contains('hscroll__panel--end')).length || panels.length;

    layout();
    window.addEventListener('resize', layout);

    if (!FG.motion) return;
    const vw = () => window.innerWidth;
    FG.motion.registerScrub(root, (prog, rect) => {
      if (!root.classList.contains('is-pinned') || distance <= 0) return;
      const H = root.offsetHeight;
      const p = FG.clamp(-rect.top / (H - window.innerHeight), 0, 1);
      track.style.transform = 'translate3d(' + (-p * distance).toFixed(1) + 'px,0,0)';
      // layered depth: each panel's media drifts a touch based on its screen position
      const w = vw();
      for (let i = 0; i < panels.length; i++) {
        const r = panels[i].getBoundingClientRect();
        const c = (r.left + r.width / 2 - w / 2) / w; // -1..1 distance from centre
        const layer = panels[i].querySelector('[data-hpara]');
        if (layer) layer.style.transform = 'translate3d(' + (c * 5).toFixed(2) + '%,0,0) scale(1.12)';
        // content reveals at the story moment — clearest when the panel is centred
        const meta = panels[i].querySelector('.hscroll__meta');
        if (meta) {
          const k = Math.min(Math.abs(c) * 1.5, 1);
          meta.style.opacity = (1 - k * 0.85).toFixed(3);
          meta.style.transform = 'translateY(' + (k * 18).toFixed(1) + 'px)';
        }
      }
      if (count) {
        const cur = Math.min(projectCount, Math.floor(p * projectCount) + 1);
        count.textContent = ('0' + cur).slice(-2) + ' / ' + ('0' + projectCount).slice(-2);
      }
    });
  }

  FG.hscroll = { init, refresh: layout };
})();
