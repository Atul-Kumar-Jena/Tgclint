/* Fluid Glass — interactions
   - Lenis smooth scroll (progressive enhancement; falls back to native)
   - lazy-image fade-in via IntersectionObserver
   - reveal-on-scroll
   - bottom nav bar + mobile menu
   - scrollspy active link
   - product detail modal
   - dynamic year
*/
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Lenis smooth scroll (optional, loaded from CDN) ---------------- */
  function initLenis() {
    if (reduceMotion || typeof window.Lenis !== 'function') return;
    const lenis = new window.Lenis({ duration: 1.1, smoothWheel: true });
    window.__lenis = lenis;
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    // anchor links route through Lenis (modal triggers handle their own clicks)
    document.querySelectorAll('a[href^="#"]:not([data-modal])').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (id.length < 2) return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: 0 });
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
  }

  /* ---- product detail modal ------------------------------------------- */
  function initModal() {
    const modal = document.getElementById('product-modal');
    if (!modal) return;
    const imgEl = modal.querySelector('#modal-img');
    const idxEl = modal.querySelector('#modal-index');
    const titleEl = modal.querySelector('#modal-title');
    const descEl = modal.querySelector('#modal-desc');
    const specsEl = modal.querySelector('#modal-specs');
    let lastFocused = null;

    function openModal(t) {
      lastFocused = t;
      imgEl.src = t.dataset.img || '';
      imgEl.alt = t.dataset.title || '';
      idxEl.textContent = t.dataset.index || '';
      titleEl.textContent = t.dataset.title || '';
      descEl.textContent = t.dataset.desc || '';
      specsEl.innerHTML = '';
      (t.dataset.specs || '').split('|').forEach((s) => {
        if (!s.trim()) return;
        const li = document.createElement('li');
        li.textContent = s.trim();
        specsEl.appendChild(li);
      });
      modal.hidden = false;
      document.documentElement.style.overflow = 'hidden';
      if (window.__lenis) window.__lenis.stop();
      requestAnimationFrame(() => modal.classList.add('open'));
      const cb = modal.querySelector('.modal-close');
      if (cb) cb.focus();
    }
    function closeModal() {
      modal.classList.remove('open');
      document.documentElement.style.overflow = '';
      if (window.__lenis) window.__lenis.start();
      window.setTimeout(() => { modal.hidden = true; }, 450);
      if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    }

    document.querySelectorAll('[data-modal]').forEach((t) => {
      t.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        openModal(t);
      });
    });
    // close on backdrop, X, or the CTA (CTA still navigates to #contact)
    modal.querySelectorAll('[data-modal-close]').forEach((el) => {
      el.addEventListener('click', () => closeModal());
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.hidden) closeModal();
    });
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
    initModal();
    initYear();
    initLenis();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
