/* Fluid Glass — interactions
   - Lenis smooth scroll (progressive enhancement; falls back to native)
   - lazy-image fade-in via IntersectionObserver
   - reveal-on-scroll
   - sticky header state + mobile nav
   - dynamic year
*/
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Lenis smooth scroll (optional, loaded from CDN) ---------------- */
  function initLenis() {
    if (reduceMotion || typeof window.Lenis !== 'function') return;
    const lenis = new window.Lenis({ duration: 1.1, smoothWheel: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    // anchor links route through Lenis
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (id.length < 2) return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -80 });
        closeNav();
      });
    });
  }

  /* ---- lazy images ---------------------------------------------------- */
  function initLazyImages() {
    const imgs = document.querySelectorAll('img.lazy-image');
    const mark = (img) => {
      if (img.complete && img.naturalWidth > 0) img.classList.add('loaded');
      else img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
      img.addEventListener('error', () => img.classList.add('loaded'), { once: true });
    };
    if (!('IntersectionObserver' in window)) { imgs.forEach(mark); return; }
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { mark(en.target); obs.unobserve(en.target); }
      });
    }, { rootMargin: '200px' });
    imgs.forEach((img) => io.observe(img));
  }

  /* ---- reveal on scroll ----------------------------------------------- */
  function initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (reduceMotion || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('in'); obs.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
  }

  /* ---- header + nav --------------------------------------------------- */
  const header = document.querySelector('.site-header');
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');

  function onScroll() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 40);
  }
  function closeNav() {
    if (nav) nav.classList.remove('open');
    if (header) header.classList.remove('menu-open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  }

  function initNav() {
    if (toggle && nav) {
      toggle.addEventListener('click', () => {
        const open = nav.classList.toggle('open');
        if (header) header.classList.toggle('menu-open', open);
        toggle.setAttribute('aria-expanded', String(open));
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- scrollspy: highlight the nav link of the section in view ------- */
  function initScrollSpy() {
    const links = [...document.querySelectorAll('.nav-links a[href^="#"]')];
    const map = new Map();
    links.forEach((l) => {
      const id = l.getAttribute('href').slice(1);
      const sec = document.getElementById(id);
      if (sec) map.set(sec, l);
    });
    if (!map.size || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          links.forEach((l) => l.classList.remove('is-active'));
          const link = map.get(en.target);
          if (link) link.classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    map.forEach((_, sec) => io.observe(sec));
  }

  /* ---- year ----------------------------------------------------------- */
  function initYear() {
    document.querySelectorAll('[data-year]').forEach((el) => {
      el.textContent = String(new Date().getFullYear());
    });
  }

  function init() {
    initLazyImages();
    initReveal();
    initNav();
    initScrollSpy();
    initYear();
    initLenis();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
