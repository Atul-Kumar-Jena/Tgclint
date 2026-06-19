/* ============================================================
   FLUID GLASS — interactions
   ============================================================ */
(function () {
  "use strict";

  const body = document.body;

  /* ---------- INTRO ---------- */
  const intro = document.getElementById("intro");
  window.addEventListener("load", () => {
    setTimeout(() => intro && intro.classList.add("is-hidden"), 1900);
  });
  // safety fallback in case load already fired
  setTimeout(() => intro && intro.classList.add("is-hidden"), 3200);

  /* ---------- COOKIES ---------- */
  const cookies = document.getElementById("cookies");
  if (cookies) {
    if (localStorage.getItem("fg_cookies")) {
      cookies.classList.add("is-hidden");
    } else {
      setTimeout(() => cookies.classList.remove("is-hidden"), 2400);
    }
    cookies.querySelectorAll("[data-cookie]").forEach((btn) => {
      btn.addEventListener("click", () => {
        localStorage.setItem("fg_cookies", btn.dataset.cookie);
        cookies.classList.add("is-hidden");
      });
    });
  }

  /* ---------- MENU ---------- */
  const burger = document.getElementById("burger");
  const close = document.getElementById("close");
  const openMenu = () => body.classList.add("is-menu");
  const closeMenu = () => body.classList.remove("is-menu");
  burger && burger.addEventListener("click", openMenu);
  close && close.addEventListener("click", closeMenu);
  document.querySelectorAll("[data-nav]").forEach((l) =>
    l.addEventListener("click", () => setTimeout(closeMenu, 60))
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  /* ---------- CUSTOM CURSOR ---------- */
  const cursor = document.getElementById("cursor");
  const cursorLabel = cursor ? cursor.querySelector(".label") : null;
  let cx = window.innerWidth / 2,
    cy = window.innerHeight / 2,
    tx = cx,
    ty = cy;

  if (cursor && window.matchMedia("(hover: hover)").matches) {
    window.addEventListener("mousemove", (e) => {
      tx = e.clientX;
      ty = e.clientY;
    });
    (function loop() {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)` +
        (cursor.classList.contains("is-visible") ? " scale(1)" : " scale(.6)");
      requestAnimationFrame(loop);
    })();

    document.querySelectorAll("[data-cursor]").forEach((el) => {
      el.addEventListener("mouseenter", () => {
        cursorLabel.textContent = el.dataset.cursor || "View";
        cursor.classList.add("is-visible");
      });
      el.addEventListener("mouseleave", () => cursor.classList.remove("is-visible"));
    });
  }

  /* ---------- SCROLL: header title sync + reveals ---------- */
  const scroll = document.getElementById("scroll");
  const titleInner = document.getElementById("titleInner");
  const sections = Array.from(document.querySelectorAll("[data-section]"));
  const titles = ["Fluid Glass", "About", "Collection", "Showroom", "Projects", "Reviews", "Get a quote"];

  // map each section to a title slot index
  const slot = {
    "Fluid Glass": 0, About: 1, Collection: 2, Showroom: 3,
    Projects: 4, Reviews: 5, "Get a quote": 6,
  };

  let currentIdx = -1;
  function setTitle(idx) {
    if (idx === currentIdx || !titleInner) return;
    currentIdx = idx;
    titleInner.style.transform = `translateY(-${idx * 5}rem)`;
  }

  // Reveal observer
  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("is-in");
          revealObs.unobserve(en.target);
        }
      });
    },
    { root: scroll, threshold: 0.15 }
  );
  document.querySelectorAll("[data-reveal]").forEach((el, i) => {
    el.style.transitionDelay = (i % 4) * 0.08 + "s";
    revealObs.observe(el);
  });

  // Active section observer (drives header title)
  const sectionObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          const name = en.target.dataset.section;
          if (name in slot) setTitle(slot[name]);
        }
      });
    },
    { root: scroll, threshold: 0.5 }
  );
  sections.forEach((s) => sectionObs.observe(s));

  /* ---------- click header logo / title -> top ---------- */
  document.querySelectorAll('a[href="#top"]').forEach((a) =>
    a.addEventListener("click", (e) => {
      e.preventDefault();
      scroll && scroll.scrollTo({ top: 0, behavior: "smooth" });
    })
  );

  /* ---------- in-page anchor links scroll within container ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    const href = a.getAttribute("href");
    if (href === "#top" || href === "#") return;
    a.addEventListener("click", (e) => {
      const target = document.querySelector(href);
      if (target && scroll) {
        e.preventDefault();
        scroll.scrollTo({ top: target.offsetTop, behavior: "smooth" });
      }
    });
  });
})();
