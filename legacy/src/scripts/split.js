/* split: wrap each <br>-delimited segment in a masked line for reveal */
(function () {
  const FG = window.FG; if (!FG) return;

  function splitEl(el) {
    if (el.dataset.splitDone) return;
    const parts = el.innerHTML.split(/<br\s*\/?>/i);
    el.innerHTML = parts
      .map((p, i) => '<span class="line"><span style="--li:' + i + '">' + p + '</span></span>')
      .join('');
    el.dataset.splitDone = '1';
  }
  function init() { document.querySelectorAll('[data-split]').forEach(splitEl); }

  FG.split = { init };
})();
