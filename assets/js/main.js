/* Fluid Glass — interactions (faithful fluid.glass behaviours)
   intro splash · custom cursor · cookie banner · capsule menu · header title ·
   Lenis smooth scroll · lazy images · reveals · scrollspy · product modal · year
*/
(function () {
  'use strict';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia('(hover: hover)').matches;

  /* ---- splash screen + cinematic entry (once per session) ------------ */
  function initIntro() {
    var intro = document.querySelector('.intro');
    if (!intro) { document.body.classList.add('ready'); return; }
    var seen = false;
    try { seen = sessionStorage.getItem('fg_intro') === '1'; } catch (e) {}
    if (seen || reduceMotion) {
      intro.classList.add('is-hidden'); intro.setAttribute('aria-hidden', 'true');
      document.body.classList.add('ready');
      return;
    }
    document.body.classList.add('has-splash');     // arm the entry animations
    var done = false;
    function finish() {
      if (done) return; done = true;
      intro.classList.add('is-hidden'); intro.setAttribute('aria-hidden', 'true');
      document.body.classList.add('ready');        // play capsule + hero entry
      try { sessionStorage.setItem('fg_intro', '1'); } catch (e) {}
    }
    window.setTimeout(finish, 2400);
    intro.addEventListener('click', finish);       // skip on click
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') finish(); });
  }

  /* ---- custom cursor -------------------------------------------------- */
  function initCursor() {
    var cursor = document.querySelector('.cursor');
    if (!cursor || !canHover || reduceMotion) { if (cursor) cursor.remove(); return; }
    var label = cursor.querySelector('.label');
    var x = 0, y = 0, cx = 0, cy = 0;
    document.addEventListener('mousemove', function (e) { x = e.clientX; y = e.clientY; });
    function raf() { cx += (x - cx) * 0.18; cy += (y - cy) * 0.18;
      cursor.style.transform = 'translate(' + (cx - 0) + 'px,' + (cy - 0) + 'px) translate(-50%,-50%)';
      requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    document.querySelectorAll('a, button, [data-cursor]').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        cursor.classList.add('is-visible');
        if (label) label.textContent = el.getAttribute('data-cursor') || 'View';
      });
      el.addEventListener('mouseleave', function () { cursor.classList.remove('is-visible'); });
    });
  }

  /* ---- cookie banner -------------------------------------------------- */
  function initCookies() {
    var c = document.querySelector('.cookies');
    if (!c) return;
    var done;
    try { done = localStorage.getItem('fg_cookies'); } catch (e) {}
    if (done) return;
    window.setTimeout(function () { c.classList.add('is-visible'); }, 1400);
    c.querySelectorAll('[data-cookie]').forEach(function (b) {
      b.addEventListener('click', function () {
        try { localStorage.setItem('fg_cookies', b.getAttribute('data-cookie')); } catch (e) {}
        c.classList.remove('is-visible');
      });
    });
  }

  /* ---- capsule menu (header + overlay) ------------------------------- */
  var header = document.querySelector('.header');
  var menuToggle = document.querySelector('.header .burger');
  var menuClose = document.querySelector('.header .close');

  function setMenu(open) {
    document.body.classList.toggle('is-menu', open);
    if (header) header.classList.toggle('is-menu', open);
    if (menuToggle) menuToggle.setAttribute('aria-expanded', String(open));
    if (window.__lenis) { open ? window.__lenis.stop() : window.__lenis.start(); }
  }
  function initMenu() {
    if (header) header.addEventListener('click', function (e) {
      // clicking the capsule (not the logo link) toggles the menu
      if (e.target.closest('.logo')) return;
      setMenu(!document.body.classList.contains('is-menu'));
    });
    if (menuClose) menuClose.addEventListener('click', function (e) { e.stopPropagation(); setMenu(false); });
    document.querySelectorAll('.menu .link').forEach(function (l) {
      l.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    // click anywhere outside the capsule/menu closes it
    document.addEventListener('click', function (e) {
      if (!document.body.classList.contains('is-menu')) return;
      if (e.target.closest('.menu') || e.target.closest('.header')) return;
      setMenu(false);
    });
  }

  /* ---- header centre title: brand ↔ active section -------------------- */
  function initHeaderTitle() {
    var inner = document.querySelector('.header .title-inner');
    if (!inner) return;
    var base = inner.getAttribute('data-base') || inner.textContent.trim();
    var sections = [].slice.call(document.querySelectorAll('section[data-name]'));
    if (!sections.length || !('IntersectionObserver' in window)) return;
    var current = base;
    function set(t) { if (t === current) return; current = t; inner.style.opacity = '0';
      window.setTimeout(function () { inner.textContent = t; inner.style.opacity = '1'; }, 200); }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) set(en.target.getAttribute('data-name') || base); });
    }, { rootMargin: '-50% 0px -49% 0px' });
    sections.forEach(function (s) { io.observe(s); });
  }

  /* ---- capsule: slide out of the way when scrolling down, slide back
     when scrolling up (familiar, predictable; never vanishes while you sit
     still). Pinned visible at the very top, at the very bottom (where it rests
     in the footer's reserved space), and while the menu is open. */
  function initHeaderHide() {
    if (!header) return;
    var last = window.scrollY, ticking = false;
    function update() {
      ticking = false;
      var y = window.scrollY;
      var maxY = document.documentElement.scrollHeight - window.innerHeight;
      if (document.body.classList.contains('is-menu') || y < 120 || y >= maxY - 4) {
        header.classList.remove('is-hidden');
      } else if (y > last + 5) {
        header.classList.add('is-hidden');       // scrolling down
      } else if (y < last - 5) {
        header.classList.remove('is-hidden');     // scrolling up
      }
      last = y;
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    if (window.__lenis && window.__lenis.on) window.__lenis.on('scroll', onScroll);
  }

  /* ---- Lenis smooth scroll ------------------------------------------- */
  function initLenis() {
    if (reduceMotion || typeof window.Lenis !== 'function') return;
    var lenis = new window.Lenis({ duration: 1.1, smoothWheel: true });
    window.__lenis = lenis;
    function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    document.querySelectorAll('a[href^="#"]:not([data-modal])').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href'); if (id.length < 2) return;
        var target = document.querySelector(id); if (!target) return;
        e.preventDefault(); lenis.scrollTo(target, { offset: 0 }); setMenu(false);
      });
    });
  }

  /* ---- lazy images ---------------------------------------------------- */
  function initLazyImages() {
    var imgs = document.querySelectorAll('img.lazy-image');
    function mark(img) {
      if (img.complete && img.naturalWidth > 0) img.classList.add('loaded');
      else img.addEventListener('load', function () { img.classList.add('loaded'); }, { once: true });
      img.addEventListener('error', function () { img.classList.add('loaded'); }, { once: true });
    }
    if (!('IntersectionObserver' in window)) { imgs.forEach(mark); return; }
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) { if (en.isIntersecting) { mark(en.target); obs.unobserve(en.target); } });
    }, { rootMargin: '200px' });
    imgs.forEach(function (img) { io.observe(img); });
  }

  /* ---- reveal on scroll ---------------------------------------------- */
  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (reduceMotion || !('IntersectionObserver' in window)) { els.forEach(function (el) { el.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); obs.unobserve(en.target); } });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---- product detail modal ------------------------------------------ */
  function initModal() {
    var modal = document.getElementById('product-modal');
    if (!modal) return;
    var imgEl = modal.querySelector('#modal-img'), idxEl = modal.querySelector('#modal-index'),
        titleEl = modal.querySelector('#modal-title'), descEl = modal.querySelector('#modal-desc'),
        specsEl = modal.querySelector('#modal-specs'); var last = null;
    function open(t) {
      last = t; imgEl.src = t.dataset.img || ''; imgEl.alt = t.dataset.title || '';
      idxEl.textContent = t.dataset.index || ''; titleEl.textContent = t.dataset.title || '';
      descEl.textContent = t.dataset.desc || ''; specsEl.innerHTML = '';
      (t.dataset.specs || '').split('|').forEach(function (s) { if (!s.trim()) return;
        var li = document.createElement('li'); li.textContent = s.trim(); specsEl.appendChild(li); });
      modal.hidden = false; document.documentElement.style.overflow = 'hidden';
      if (window.__lenis) window.__lenis.stop();
      requestAnimationFrame(function () { modal.classList.add('open'); });
      var cb = modal.querySelector('.modal-close'); if (cb) cb.focus();
    }
    function close() {
      modal.classList.remove('open'); document.documentElement.style.overflow = '';
      if (window.__lenis) window.__lenis.start();
      window.setTimeout(function () { modal.hidden = true; }, 450);
      if (last && last.focus) last.focus();
    }
    document.querySelectorAll('[data-modal]').forEach(function (t) {
      t.addEventListener('click', function (e) { e.preventDefault(); e.stopImmediatePropagation(); open(t); });
    });
    modal.querySelectorAll('[data-modal-close]').forEach(function (el) { el.addEventListener('click', close); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) close(); });
  }

  /* ---- card-stacking page transition --------------------------------- */
  function initPageTransition() {
    var pt = document.querySelector('.pt');
    if (!pt) return;
    // When a page is restored from the back/forward cache it comes back exactly
    // as it was left — which, after tapping a link, is mid-transition with the
    // .pt overlay (the "S" card) covering everything. Clear that on restore so
    // the Back button never lands on a blank "S" screen (common on mobile).
    window.addEventListener('pageshow', function (e) {
      if (!e.persisted) return;
      pt.classList.remove('leave', 'enter');
      document.body.classList.remove('pt-in');
      var intro = document.querySelector('.intro');
      if (intro) { intro.classList.add('is-hidden'); intro.setAttribute('aria-hidden', 'true'); }
      document.body.classList.add('ready');
    });
    // entrance: only after an in-site navigation
    try {
      if (sessionStorage.getItem('pt') === '1') {
        sessionStorage.removeItem('pt');
        if (!reduceMotion) { pt.classList.add('enter'); document.body.classList.add('pt-in'); }
      }
    } catch (e) {}
    if (reduceMotion) return;
    document.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
      var a = e.target.closest('a');
      if (!a) return;
      var href = a.getAttribute('href');
      if (!href || a.target === '_blank' || a.hasAttribute('download')) return;
      if (href.charAt(0) === '#' || /^(mailto:|tel:|https?:|\/\/)/.test(href)) return;
      // same-origin internal navigation → animate, then go
      e.preventDefault();
      if (typeof setMenu === 'function') setMenu(false);
      var url = a.href;
      try { sessionStorage.setItem('pt', '1'); } catch (err) {}
      pt.classList.add('leave');
      window.setTimeout(function () { window.location.href = url; }, 560);
    });
  }

  /* ---- horizontal side-scroll galleries ------------------------------ */
  function initHScroll() {
    var secs = [].slice.call(document.querySelectorAll('.hscroll'));
    if (!secs.length || reduceMotion) return;
    var mq = window.matchMedia('(min-width: 1025px)');

    function setup() {
      secs.forEach(function (sec) {
        var track = sec.querySelector('.track');
        if (mq.matches) {
          sec.classList.add('is-hscroll');
          var dist = Math.max(0, track.scrollWidth - window.innerWidth);
          sec._dist = dist;
          sec.style.height = (window.innerHeight + dist) + 'px';
        } else {
          sec.classList.remove('is-hscroll');
          sec.style.height = '';
          track.style.transform = '';
        }
      });
    }
    function onScroll() {
      if (!mq.matches) return;
      secs.forEach(function (sec) {
        var track = sec.querySelector('.track');
        var y = -sec.getBoundingClientRect().top;
        var dist = sec._dist || 0;
        var x = Math.min(Math.max(y, 0), dist);
        track.style.transform = 'translate3d(' + (-x) + 'px,0,0)';
        // fullscreen image unveil: ramp --rv to 1 as each media panel centres
        var media = sec.querySelectorAll('.story-panel--media');
        if (media.length) {
          var vw = window.innerWidth, vc = vw / 2;
          media.forEach(function (m) {
            var r = m.getBoundingClientRect();
            var d = Math.abs((r.left + r.width / 2) - vc) / vw;   // 0 centred → ~1 a viewport away
            var rv = Math.max(0, 1 - d * 1.5);
            rv = rv * rv * (3 - 2 * rv);                          // smoothstep
            m.style.setProperty('--rv', rv.toFixed(3));
          });
        }
        // progress UI
        var n = parseInt(sec.getAttribute('data-count') || '0', 10);
        if (n) {
          var prog = dist ? x / dist : 0;
          var bar = sec.querySelector('.hbar i');
          if (bar) bar.style.width = (Math.max(prog, 0.02) * 100).toFixed(1) + '%';
          var cnt = sec.querySelector('.hcount');
          if (cnt) {
            var idx = Math.min(n, Math.floor(prog * n) + 1);
            cnt.textContent = ('0' + idx).slice(-2) + ' / ' + ('0' + n).slice(-2);
          }
        }
      });
    }
    setup(); onScroll();
    window.addEventListener('resize', function () { setup(); onScroll(); }, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    if (window.__lenis && window.__lenis.on) window.__lenis.on('scroll', onScroll);
    window.addEventListener('load', function () { setup(); onScroll(); });
  }

  /* ---- services showcase accordion ----------------------------------- */
  function initServices() {
    var rows = [].slice.call(document.querySelectorAll('[data-service]'));
    var imgs = [].slice.call(document.querySelectorAll('.services-stage .img'));
    if (!rows.length) return;
    rows.forEach(function (row) {
      row.querySelector('.service-row__head').addEventListener('click', function () {
        var key = row.getAttribute('data-service');
        var wasActive = row.classList.contains('active');
        // measure where the row sits BEFORE the layout changes, and how much a
        // currently-open row ABOVE it will shrink when it collapses — so we can
        // scroll the clicked row to a consistent spot instead of it jumping.
        var beforeTop = row.getBoundingClientRect().top;
        var shift = 0;
        var prev = document.querySelector('.service-row.active');
        if (!wasActive && prev && prev !== row) {
          var pr = prev.getBoundingClientRect();
          if (pr.top < beforeTop) {
            var pb = prev.querySelector('.service-row__body');
            if (pb) shift = pb.scrollHeight;
          }
        }
        rows.forEach(function (r) { r.classList.remove('active'); });
        if (!wasActive) row.classList.add('active');
        imgs.forEach(function (im) { im.classList.toggle('active', im.getAttribute('data-stage') === key && !wasActive); });
        if (wasActive && imgs[0]) { imgs.forEach(function (im, i) { im.classList.toggle('active', i === 0); }); }
        if (!wasActive) {
          var offset = window.innerWidth <= 1024 ? 80 : 116;   // px clearance from top
          var target = Math.max(0, window.scrollY + beforeTop - shift - offset);
          if (window.__lenis) window.__lenis.scrollTo(target, { duration: 0.7 });
          else window.scrollTo({ top: target, behavior: 'smooth' });
        }
      });
    });
  }

  /* ---- stories: horizontal browse row (cards link to story pages) ----- */
  function initStories() {
    var browse = document.querySelector('[data-stories-browse]');
    if (!browse) return;
    var hint = document.querySelector('[data-drag-hint]');
    if (hint) {
      var dismissed = false;
      browse.addEventListener('scroll', function () { if (!dismissed) { hint.classList.add('hidden'); dismissed = true; } }, { passive: true });
    }
    // drag-to-scroll (without breaking card link clicks)
    var down = false, moved = false, startX = 0, startScroll = 0;
    browse.addEventListener('pointerdown', function (e) { down = true; moved = false; startX = e.clientX; startScroll = browse.scrollLeft; });
    window.addEventListener('pointerup', function () { down = false; });
    browse.addEventListener('pointermove', function (e) {
      if (!down) return;
      if (Math.abs(e.clientX - startX) > 6) moved = true;
      browse.scrollLeft = startScroll - (e.clientX - startX);
    });
    browse.addEventListener('click', function (e) { if (moved) { e.preventDefault(); } }, true);
  }

  /* ---- hero video support (poster shows until a real .mp4 is provided) - */
  function initVideo() {
    document.querySelectorAll('[data-hero-video]').forEach(function (v) {
      var src = v.getAttribute('data-src');
      if (!src) return;                       // no real video yet → keep poster image
      var s = document.createElement('source');
      s.src = src; s.type = 'video/mp4';
      v.appendChild(s);
      v.load();
      v.addEventListener('canplay', function () { v.classList.add('ready'); v.play().catch(function () {}); }, { once: true });
      v.addEventListener('error', function () {}, { once: true });   // poster remains
    });
  }

  /* ---- subtle scroll parallax on media ------------------------------- */
  function initParallax() {
    if (reduceMotion) return;
    var els = [].slice.call(document.querySelectorAll('[data-parallax], .banner .media, .assets-duo .figure'));
    if (!els.length) return;
    var ticking = false;
    function update() {
      ticking = false;
      var vh = window.innerHeight;
      els.forEach(function (el) {
        var media = el.querySelector('img, video');
        if (!media) return;
        var r = el.getBoundingClientRect();
        if (r.bottom < -50 || r.top > vh + 50) return;
        var prog = (r.top + r.height / 2 - vh / 2) / vh;   // -1 … 1 across viewport
        media.style.transform = 'translate3d(0,' + (prog * -5).toFixed(2) + '%,0)';
      });
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    if (window.__lenis && window.__lenis.on) window.__lenis.on('scroll', onScroll);
    update();
  }

  function initScrollProgress() {
    var bar = document.querySelector('[data-scroll-progress]');
    if (!bar) return;
    function update() {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    if (window.__lenis && window.__lenis.on) window.__lenis.on('scroll', update);
    update();
  }

  function initYear() { document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = String(new Date().getFullYear()); }); }

  function init() {
    initIntro(); initCursor(); initCookies(); initMenu(); initHeaderTitle();
    initLazyImages(); initReveal(); initModal(); initServices(); initStories();
    initVideo(); initPageTransition(); initScrollProgress(); initYear(); initLenis(); initHScroll(); initParallax();
    initHeaderHide();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
