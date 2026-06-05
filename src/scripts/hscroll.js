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
      if (panels) panels.forEach((p) => { const l = p.querySelector('[data-hpara]'); if (l) l.style.transform = ''; });
      distance = 0;
      return;
    }
    root.classList.add('is-pinned');
    track.style.transform = 'translate3d(0,0,0)';
    distance = Math.max(0, track.scrollWidth - window.innerWidth);
    root.style.height = (window.innerHeight + distance) + 'px';
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
        const layer = panels[i].querySelector('[data-hpara]');
        if (!layer) continue;
        const r = panels[i].getBoundingClientRect();
        const c = (r.left + r.width / 2 - w / 2) / w; // -1..1
        layer.style.transform = 'translate3d(' + (c * 5).toFixed(2) + '%,0,0) scale(1.12)';
      }
      if (count) {
        const cur = Math.min(projectCount, Math.floor(p * projectCount) + 1);
        count.textContent = ('0' + cur).slice(-2) + ' / ' + ('0' + projectCount).slice(-2);
      }
    });
  }

  FG.hscroll = { init, refresh: layout };
})();
