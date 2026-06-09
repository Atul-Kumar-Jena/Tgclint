/* router: client-side page swaps (SPA feel) so navigation never reloads the whole
 * document. Persistent chrome (nav, cursor, smooth-scroll) stays mounted while the
 * new page card rises over the frozen previous one. Any failure -> full navigation. */
(function () {
  const FG = window.FG; if (!FG) return;

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  let busy = false;
  const cache = {};
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const hardNav = (href) => { window.location.href = href; };

  async function fetchDoc(href) {
    if (cache[href]) return cache[href];
    const res = await fetch(href, { credentials: 'same-origin' });
    if (!res.ok) throw new Error('status ' + res.status);
    const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
    cache[href] = doc;
    return doc;
  }

  function syncTopbar(doc) {
    const cur = document.querySelector('.topbar');
    const next = doc.querySelector('.topbar');
    const main = document.getElementById('main');
    if (cur && !next) cur.remove();
    else if (!cur && next && main) main.parentNode.insertBefore(document.importNode(next, true), main);
  }
  function syncActive(doc) {
    ['.endnav__links a', '.menu__link', '.menu__sub', '.footer__nav a'].forEach((sel) => {
      const cur = document.querySelectorAll(sel), nxt = doc.querySelectorAll(sel);
      cur.forEach((el, i) => {
        if (nxt[i] && nxt[i].getAttribute('aria-current')) el.setAttribute('aria-current', 'page');
        else el.removeAttribute('aria-current');
      });
    });
  }

  async function go(href, opts) {
    opts = opts || {};
    if (busy) return;
    let url; try { url = new URL(href, location.href); } catch (_) { return hardNav(href); }
    if (url.origin !== location.origin) return hardNav(href);

    busy = true;
    document.documentElement.classList.add('is-routing');
    FG.menu && FG.menu.close();
    FG.quote && FG.quote.close();
    const pill = document.querySelector('[data-pill]');
    if (pill) pill.classList.remove('pill--hidden');

    const oldMain = document.getElementById('main');
    let doc;
    try { doc = await fetchDoc(url.href); }
    catch (e) { return hardNav(href); }
    const incoming = doc.getElementById('main');
    if (!oldMain || !incoming) return hardNav(href);

    try {
      // freeze the current page in place (no transform -> no drift), fade it beneath
      const y = (FG.scroll ? FG.scroll.y : window.scrollY) | 0;
      oldMain.style.position = 'fixed';
      oldMain.style.top = (-y) + 'px';
      oldMain.style.left = '0';
      oldMain.style.right = '0';
      oldMain.style.width = '100%';
      oldMain.removeAttribute('id');
      oldMain.classList.add('spa-prev');
      requestAnimationFrame(() => oldMain.classList.add('spa-prev--out'));

      await wait(360); // let the previous card settle beneath

      FG.page && FG.page.teardown();

      const next = document.importNode(incoming, true);
      next.classList.add('spa-enter', 'spa-anim');
      oldMain.parentNode.insertBefore(next, oldMain.nextSibling);

      // meta / chrome
      const t = doc.querySelector('title'); if (t) document.title = t.textContent;
      document.documentElement.setAttribute('data-initial-theme', doc.body.getAttribute('data-initial-theme') || 'light');
      const lbl = document.querySelector('[data-pill-label]'); const nl = doc.querySelector('[data-pill-label]');
      if (lbl && nl) lbl.textContent = nl.textContent;
      syncActive(doc);
      syncTopbar(doc);
      if (opts.push !== false) history.pushState({ spa: true }, '', url.href);

      // start the new page at its top
      FG.scroll && FG.scroll.scrollTo(0, { immediate: true });
      window.scrollTo(0, 0);

      // re-init page-scoped behaviour for the new content
      FG.page && FG.page.init();
      FG.motion && FG.motion.revealHero();

      // raise the card onto the stage
      requestAnimationFrame(() => requestAnimationFrame(() => next.classList.remove('spa-enter')));

      await wait(950);
      const prev = document.querySelector('.spa-prev'); if (prev) prev.remove();
      next.classList.remove('spa-anim');
      FG.scroll && FG.scroll.refresh();
      FG.motion && FG.motion.collect();
      FG.hscroll && FG.hscroll.refresh();

      if (url.hash) {
        const el = document.getElementById(url.hash.slice(1));
        if (el) FG.nav && FG.nav.scrollToEl(el, 12);
      }
    } catch (e) {
      console.error('[router]', e);
      return hardNav(href);
    } finally {
      document.documentElement.classList.remove('is-routing');
      busy = false;
    }
  }

  window.addEventListener('popstate', () => go(location.href, { push: false }));
  FG.router = { go };
})();
