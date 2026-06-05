/* cursor: blended dot that grows over interactive elements (fine pointers only) */
(function () {
  const FG = window.FG; if (!FG || FG.isTouch) return;

  function init() {
    const dot = document.createElement('div');
    dot.className = 'cursor';
    document.body.appendChild(dot);
    let x = window.innerWidth / 2, y = window.innerHeight / 2, tx = x, ty = y;

    window.addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; dot.classList.add('is-active'); }, { passive: true });
    window.addEventListener('mouseleave', () => dot.classList.remove('is-active'));
    document.addEventListener('mouseover', (e) => { if (e.target.closest('a, button, [data-hover], .chip, label')) dot.classList.add('is-hover'); });
    document.addEventListener('mouseout', (e) => { if (e.target.closest('a, button, [data-hover], .chip, label')) dot.classList.remove('is-hover'); });

    FG.onTick(() => {
      x = FG.lerp(x, tx, 0.14); y = FG.lerp(y, ty, 0.14);
      dot.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) translate(-50%,-50%)';
    });
  }

  FG.cursor = { init };
})();
