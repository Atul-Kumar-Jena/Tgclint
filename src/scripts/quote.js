/* quote: slide-in enquiry panel + client-side form acknowledgement */
(function () {
  const FG = window.FG; if (!FG) return;

  function init() {
    const quote = document.getElementById('quote'); if (!quote) return;
    const panel = quote.querySelector('.quote__panel');
    const openers = document.querySelectorAll('[data-quote-open]');
    const closers = quote.querySelectorAll('[data-quote-close]');
    const pill = document.querySelector('[data-pill]');
    const form = quote.querySelector('[data-quote-form]');
    const done = quote.querySelector('[data-quote-done]');
    let lastFocus = null;

    function open() {
      lastFocus = document.activeElement;
      FG.menu && FG.menu.close();
      quote.setAttribute('aria-hidden', 'false');
      document.body.classList.add('is-locked');
      FG.scroll && FG.scroll.lock();
      pill && pill.classList.add('pill--hidden');
      setTimeout(() => panel && panel.focus(), 60);
    }
    function close() {
      if (quote.getAttribute('aria-hidden') === 'true') return;
      quote.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('is-locked');
      FG.scroll && FG.scroll.unlock();
      pill && pill.classList.remove('pill--hidden');
      lastFocus && lastFocus.focus && lastFocus.focus();
    }

    openers.forEach((o) => o.addEventListener('click', open));
    closers.forEach((c) => c.addEventListener('click', close));
    quote.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

    if (form) form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('#q-name');
      const email = form.querySelector('#q-email');
      let ok = true;
      [name, email].forEach((f) => {
        if (f && !f.value.trim()) { f.style.borderColor = '#b4543f'; ok = false; }
        else if (f) { f.style.borderColor = ''; }
      });
      if (email && email.value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)) { email.style.borderColor = '#b4543f'; ok = false; }
      if (!ok) return;
      if (done) {
        Array.from(form.children).forEach((c) => { if (c !== done) c.style.display = 'none'; });
        done.hidden = false;
      }
    });

    FG.quote = { open, close };
  }

  FG.quoteInit = init;
})();
