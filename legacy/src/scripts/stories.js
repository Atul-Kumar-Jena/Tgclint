/* stories: scroll-scrubbed testimonial carousel with a ticking counter */
(function () {
  const FG = window.FG; if (!FG) return;

  function init() {
    const root = document.querySelector('[data-stories]'); if (!root) return;
    const track = root.querySelector('.stories__track');
    const slides = Array.prototype.slice.call(root.querySelectorAll('.story'));
    const counter = root.querySelector('[data-stories-counter] b');
    const n = slides.length; if (!n) return;
    let cur = -1;

    function set(i) {
      if (i === cur) return; cur = i;
      slides.forEach((s, k) => {
        s.toggleAttribute('data-active', k === i);
        s.toggleAttribute('data-prev', k < i);
      });
      if (counter) counter.textContent = ('0' + (i + 1)).slice(-2);
    }
    set(0);

    if (FG.reduce || !track) return;
    FG.motion.registerScrub(track, (prog) => {
      set(FG.clamp(Math.floor(prog * n - 1e-4), 0, n - 1));
    });
  }

  FG.stories = { init };
})();
