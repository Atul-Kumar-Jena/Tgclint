/* cursor: frosted-glass follower with inertia; becomes an EXPLORE capsule over media */
(function () {
  const FG = window.FG; if (!FG || FG.isTouch) return;

  const EXPLORE = '[data-cursor="explore"], .card, .gallery__item, .project-media, .project-next, .feature__frame, .showroom__media, .hscroll__panel, .cta__pavilion, .page-hero__media, .project-hero__media';
  const HOVER = 'a, button, .chip, label, [data-hover]';

  function init() {
    const el = document.createElement('div');
    el.className = 'cursor';
    el.innerHTML = '<span class="cursor__label">Explore</span>';
    document.body.appendChild(el);
    document.documentElement.classList.add('has-glass-cursor');

    let x = window.innerWidth / 2, y = window.innerHeight / 2, tx = x, ty = y;

    window.addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; el.classList.add('is-active'); }, { passive: true });
    window.addEventListener('mouseleave', () => el.classList.remove('is-active'));

    // mouseover bubbles and fires for whatever is under the pointer -> derive state from it
    document.addEventListener('mouseover', (e) => {
      const t = e.target;
      const explore = t && t.closest && t.closest(EXPLORE);
      const hover = !explore && t && t.closest && t.closest(HOVER);
      el.classList.toggle('is-explore', !!explore);
      el.classList.toggle('is-hover', !!hover);
    });

    FG.onTick(() => {
      x = FG.lerp(x, tx, 0.16); y = FG.lerp(y, ty, 0.16);
      el.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0) translate(-50%,-50%)';
    });
  }

  FG.cursor = { init };
})();
