/* ============================================================
   SAANSUD INFRA — Fluid Glass interaction engine
   Compositor-only animation. No layout thrash. No z-index hacks.
   ============================================================ */
(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ---------- Nav: glass on scroll ---------- */
  const nav = $("[data-nav]");
  if (nav) {
    let navTick = false;
    const setNav = () => { nav.classList.toggle("scrolled", window.scrollY > 24); navTick = false; };
    setNav();
    addEventListener("scroll", () => { if (!navTick) { navTick = true; requestAnimationFrame(setNav); } }, { passive: true });
  }

  /* ---------- Mobile menu ---------- */
  const menu = $("[data-menu]");
  const menuBtn = $("[data-menu-btn]");
  if (menu && menuBtn) {
    menu.removeAttribute("hidden");
    const setMenu = (open) => {
      menu.classList.toggle("open", open);
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.classList.toggle("menu-locked", open);
    };
    menuBtn.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
    menu.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
    addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
  }

  /* ---------- Image unveil tagging ----------
     Give every photo its own personality: each media container gets a
     seeded wipe direction + a small individual delay, so images across
     the site uncover with quiet, organic variety. */
  const UNVEIL_SEL = ".media-card, .tile, .proj-media, .post-media, .leader-photo, .article figure";
  const DIRS = ["", "uv-r", "uv-u", "uv-d", "", "uv-u", "uv-r", ""];
  if (!reduceMotion) {
    $$(UNVEIL_SEL).forEach((el, i) => {
      if (el.querySelector("img") == null) return;
      const h = Math.abs(Math.sin((i + 1) * 91.7)) ;
      el.classList.add("unveil");
      const dir = DIRS[Math.floor(h * DIRS.length) % DIRS.length];
      if (dir) el.classList.add(dir);
      if (!el.style.getPropertyValue("--d")) el.style.setProperty("--d", `${(h * 0.28).toFixed(2)}s`);
      el.classList.add("rv-img"); // marker: observed for unveil only
    });
  }

  /* ---------- Reveal on scroll ---------- */
  const ro = new IntersectionObserver((entries) => {
    for (const en of entries) if (en.isIntersecting) { en.target.classList.add("in"); ro.unobserve(en.target); }
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  $$(".rv, .rv-img").forEach((el) => ro.observe(el));

  // release compositor layers once entrance transitions settle —
  // dozens of pre-promoted .rv/.unveil layers would tax mobile GPUs
  document.addEventListener("transitionend", (e) => {
    const el = e.target;
    if (el.classList && el.classList.contains("in") &&
        (e.propertyName === "opacity" || e.propertyName === "clip-path")) {
      el.style.willChange = "auto";
      const img = el.querySelector(":scope > img");
      if (img) img.style.willChange = "auto";
    }
  }, { passive: true });

  /* ---------- Counters ---------- */
  const fmtIN = (n) => n.toLocaleString("en-US");
  const co = new IntersectionObserver((entries) => {
    for (const en of entries) {
      if (!en.isIntersecting) continue;
      co.unobserve(en.target);
      const el = en.target;
      const end = parseFloat(el.dataset.count);
      if (reduceMotion) { el.textContent = fmtIN(end); continue; }
      const dur = 1800, t0 = performance.now();
      const step = (t) => {
        const p = Math.min(1, (t - t0) / dur);
        const e = 1 - Math.pow(1 - p, 4);
        el.textContent = fmtIN(Math.round(end * e));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  }, { threshold: 0.4 });
  $$("[data-count]").forEach((el) => { el.textContent = "0"; co.observe(el); });

  /* ---------- Hero rotator ---------- */
  $$("[data-rotator]").forEach((rot) => {
    const slides = $$(".hero-slide", rot);
    const dots = $$(".hero-dots button", rot.parentElement);
    if (slides.length < 2) return;
    let i = 0, timer = null;
    const show = (n) => {
      i = (n + slides.length) % slides.length;
      slides.forEach((s, k) => s.classList.toggle("active", k === i));
      dots.forEach((d, k) => d.setAttribute("aria-selected", String(k === i)));
    };
    const play = () => { if (!reduceMotion) timer = setInterval(() => show(i + 1), 6200); };
    const stop = () => clearInterval(timer);
    dots.forEach((d, k) => d.addEventListener("click", () => { stop(); show(k); play(); }));
    rot.addEventListener("pointerenter", stop);
    rot.addEventListener("pointerleave", () => { stop(); play(); });
    document.addEventListener("visibilitychange", () => document.hidden ? stop() : (stop(), play()));
    show(0); play();
  });

  /* ---------- Stack engine ----------
     Cards are position:sticky in natural DOM order (correct paint
     order, so no z-index management is ever needed). While a card is
     pinned and the next card travels over it, the pinned card eases
     back in scale and dims — transform/filter only, computed in one
     rAF pass per frame. No flicker, no jumps, no clipping. */
  const stacks = $$("[data-stack]");
  if (stacks.length && !reduceMotion) {
    const all = [];
    stacks.forEach((stack) => {
      const cards = $$(".stack-card", stack);
      cards.forEach((c, k) => c.style.setProperty("--i", k));
      all.push(cards);
    });
    let ticking = false;
    const update = () => {
      ticking = false;
      const vh = window.innerHeight;
      for (const cards of all) {
        const rects = cards.map((c) => c.getBoundingClientRect());
        // skip stacks far outside the viewport entirely
        if (rects[rects.length - 1].bottom < -vh || rects[0].top > vh * 2) continue;
        for (let k = 0; k < cards.length - 1; k++) {
          const span = Math.max(1, rects[k].height * 0.9);
          // how deep card k sits in the pile = how far later cards have
          // travelled up over it (each contributes 0..1)
          let depth = 0;
          for (let j = k + 1; j < cards.length; j++) {
            depth += Math.max(0, Math.min(1, (vh * 0.82 - rects[j].top) / span));
          }
          depth = Math.min(depth, 3);
          const s = 1 - 0.055 * depth;
          const card = cards[k];
          card.style.transform = `scale(${s.toFixed(4)})`;
          card.style.filter = depth > 0.01
            ? `brightness(${(1 - 0.13 * depth).toFixed(3)}) saturate(${(1 - 0.08 * depth).toFixed(3)})`
            : "";
        }
      }
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll, { passive: true });
    update();
  }

  /* ---------- Horizontal rails ----------
     Fluid-glass behaviour: items continuously "unfold" as they travel
     toward the viewport centre — easing in scale, perspective tilt and
     light. Each card carries a tiny seeded variation so the motion
     feels organic rather than mechanical. Compositor-only. */
  $$("[data-hscroll]").forEach((wrap, railIdx) => {
    const rail = $(".hscroll", wrap);
    if (!rail) return;
    const prev = $("[data-prev]", wrap.parentElement);
    const next = $("[data-next]", wrap.parentElement);
    const bar  = $(".hscroll-bar i", wrap.parentElement);

    const items = [...rail.children];
    // seeded pseudo-random per card: direction, intensity, drift
    const seeds = items.map((_, i) => {
      const s = Math.sin((i + 1) * 12.9898 + railIdx * 78.233) * 43758.5453;
      return s - Math.floor(s); // 0..1
    });
    let fluidOn = !reduceMotion;
    const mqMobile = window.matchMedia("(max-width: 719px)");
    const fluid = () => {
      if (!fluidOn) return;
      const vw = rail.clientWidth;
      const railBox = rail.getBoundingClientRect();
      const mid = railBox.left + vw / 2;
      const mob = mqMobile.matches;
      // phone = spotlight carousel (centred card pops, neighbours recede)
      // desktop = gallery unfold (perspective tilt + organic drift)
      const tiltBase = mob ? 2.5 : 4.5, tiltVar = mob ? 1.5 : 3.5;
      const scaleAmt = mob ? 0.085 : 0.07;
      const fadeAmt  = mob ? 0.3   : 0.22;
      const liftAmt  = mob ? 6     : 14;
      items.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        if (r.right < railBox.left - 200 || r.left > railBox.right + 200) return;
        const c = r.left + r.width / 2;
        let t = (c - mid) / (vw * 0.72);          // -1 … 1 across the rail
        t = Math.max(-1.2, Math.min(1.2, t));
        const a = Math.abs(t);
        const rnd = seeds[i];
        const tilt = (tiltBase + rnd * tiltVar) * t * -1; // unfold toward viewer
        const scale = 1 - scaleAmt * a;
        const lift = (rnd - 0.5) * liftAmt * a;   // organic vertical drift
        el.style.transform =
          `perspective(1100px) translateY(${lift.toFixed(1)}px) rotateY(${tilt.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
        el.style.opacity = String(1 - fadeAmt * Math.min(1, a));
        // filter is the costliest channel — desktop only
        el.style.filter = (!mob && a > 0.04) ? `brightness(${(1 - 0.1 * a).toFixed(3)})` : "";
      });
    };
    let fluidTick = false;
    const queueFluid = () => { if (!fluidTick) { fluidTick = true; requestAnimationFrame(() => { fluidTick = false; fluid(); }); } };
    if (fluidOn) {
      rail.addEventListener("scroll", queueFluid, { passive: true });
      addEventListener("resize", queueFluid, { passive: true });
      // settle the unfold once the rail itself scrolls into view
      new IntersectionObserver((en, io) => {
        if (en[0].isIntersecting) { fluid(); io.disconnect(); }
      }, { threshold: 0.1 }).observe(rail);
      fluid();
    }

    const stepSize = () => {
      const card = rail.children[0];
      return card ? card.getBoundingClientRect().width + 24 : rail.clientWidth * 0.8;
    };
    prev && prev.addEventListener("click", () => rail.scrollBy({ left: -stepSize(), behavior: "smooth" }));
    next && next.addEventListener("click", () => rail.scrollBy({ left:  stepSize(), behavior: "smooth" }));

    const sync = () => {
      const max = rail.scrollWidth - rail.clientWidth;
      if (prev) prev.disabled = rail.scrollLeft < 8;
      if (next) next.disabled = rail.scrollLeft > max - 8;
      if (bar && max > 0) {
        const w = Math.max(0.18, rail.clientWidth / rail.scrollWidth);
        bar.style.width = `${w * 100}%`;
        bar.style.transform = `translateX(${(rail.scrollLeft / max) * (100 / w - 100)}%)`;
      }
    };
    rail.addEventListener("scroll", () => requestAnimationFrame(sync), { passive: true });
    addEventListener("resize", sync, { passive: true });
    sync();

    // drag-to-scroll for mouse users
    let down = false, startX = 0, startL = 0, moved = false;
    rail.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "mouse") return;
      down = true; moved = false; startX = e.clientX; startL = rail.scrollLeft;
      rail.classList.add("dragging");
    });
    addEventListener("pointermove", (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      rail.scrollLeft = startL - dx;
    });
    addEventListener("pointerup", () => { down = false; rail.classList.remove("dragging"); });
    rail.addEventListener("click", (e) => { if (moved) { e.preventDefault(); moved = false; } }, true);
  });

  /* ---------- Donut chart ---------- */
  $$("[data-donut]").forEach((box) => {
    const segs = $$("circle[data-seg]", box);
    const C = 2 * Math.PI * 80; // r=80
    let acc = 0;
    segs.forEach((c) => {
      const val = parseFloat(c.dataset.seg) / 100;
      const len = Math.max(0, C * val - 3); // 3px breathing gap
      c.dataset.target = `${len} ${C - len}`;
      c.setAttribute("stroke-dasharray", `0 ${C}`);
      c.setAttribute("stroke-dashoffset", String(-acc * C));
      c.style.transition = "stroke-dasharray 1.3s cubic-bezier(.22,.61,.21,1)";
      acc += val;
    });
    const io = new IntersectionObserver((en) => {
      if (!en[0].isIntersecting) return;
      io.disconnect();
      segs.forEach((c, k) => setTimeout(() => c.setAttribute("stroke-dasharray", c.dataset.target), reduceMotion ? 0 : 160 * k));
    }, { threshold: 0.4 });
    io.observe(box);
  });

  /* ---------- Toast ---------- */
  let toastEl = null, toastTimer = null;
  const toast = (msg) => {
    if (!toastEl) { toastEl = document.createElement("div"); toastEl.className = "toast"; toastEl.setAttribute("role", "status"); document.body.appendChild(toastEl); }
    toastEl.textContent = msg;
    requestAnimationFrame(() => toastEl.classList.add("show"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 3000);
  };

  /* ---------- Share buttons ---------- */
  $$("[data-share]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const url = btn.dataset.share === "page" ? location.href : new URL(btn.dataset.share, location.href).href;
      const title = btn.dataset.shareTitle || document.title;
      try {
        if (navigator.share) { await navigator.share({ title, url }); return; }
        await navigator.clipboard.writeText(url);
        toast("Link copied to clipboard");
      } catch (_) { /* user dismissed share sheet */ }
    });
  });

  /* ---------- Contact form (mail handoff) ---------- */
  const form = $("[data-form]");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const d = new FormData(form);
      const subject = `Website enquiry — ${d.get("department")} — ${d.get("name")}`;
      const body = [
        `Name: ${d.get("name")}`,
        `Email: ${d.get("email")}`,
        `Phone: ${d.get("phone")}`,
        `Department: ${d.get("department")}`,
        "", String(d.get("message") || "").trim(),
      ].join("\n");
      location.href = `mailto:info@saansud.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      toast("Opening your mail app — we reply within 24 hours");
    });
  }

  /* ---------- Footer year ---------- */
  $$("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
