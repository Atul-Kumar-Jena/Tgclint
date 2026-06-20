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

  function initYear() { document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = String(new Date().getFullYear()); }); }

  function init() {
    initIntro(); initCursor(); initCookies(); initMenu(); initHeaderTitle();
    initLazyImages(); initReveal(); initModal(); initPageTransition(); initYear(); initLenis(); initHScroll();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
