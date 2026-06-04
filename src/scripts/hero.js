/* hero: lightweight "fluid glass" caustic light field on a 2D canvas */
(function () {
  const FG = window.FG; if (!FG) return;

  function init(canvas) {
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;
    let w = 1, h = 1, dpr = 1;
    const N = FG.isTouch ? 5 : 7;
    const palette = [[126, 162, 182], [150, 182, 170], [108, 140, 168], [183, 162, 146], [120, 150, 160], [140, 170, 175], [100, 132, 150]];
    const blobs = [];
    for (let i = 0; i < N; i++) {
      blobs.push({
        bx: Math.random(), by: Math.random(),
        r: 0.26 + Math.random() * 0.34,
        ph: Math.random() * Math.PI * 2,
        sp: 0.00022 + Math.random() * 0.00035,
        ax: 0.05 + Math.random() * 0.05, ay: 0.05 + Math.random() * 0.05,
        c: palette[i % palette.length]
      });
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 1.6);
      w = canvas.clientWidth || canvas.offsetWidth || window.innerWidth;
      h = canvas.clientHeight || canvas.offsetHeight || window.innerHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw(now, dt) {
      if (!running) return;
      ctx.globalCompositeOperation = 'source-over';
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, '#0c0d10'); g.addColorStop(0.6, '#101216'); g.addColorStop(1, '#16181c');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);

      ctx.globalCompositeOperation = 'lighter';
      const t = now || 0;
      for (const b of blobs) {
        b.ph += b.sp * (dt || 16);
        const x = (b.bx + Math.sin(b.ph) * b.ax) * w;
        const y = (b.by + Math.cos(b.ph * 0.82) * b.ay) * h;
        const rad = b.r * Math.max(w, h) * 0.8;
        const rg = ctx.createRadialGradient(x, y, 0, x, y, rad);
        const c = b.c;
        rg.addColorStop(0, 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',0.15)');
        rg.addColorStop(0.5, 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',0.05)');
        rg.addColorStop(1, 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',0)');
        ctx.fillStyle = rg;
        ctx.beginPath(); ctx.arc(x, y, rad, 0, Math.PI * 2); ctx.fill();
      }

      // faint vertical "glass" striations
      ctx.globalCompositeOperation = 'soft-light';
      const cols = 9;
      for (let i = 0; i < cols; i++) {
        const x = (i / cols) * w + Math.sin(t * 0.0002 + i) * 16;
        ctx.fillStyle = i % 2 ? 'rgba(255,255,255,0.018)' : 'rgba(0,0,0,0.03)';
        ctx.fillRect(x, 0, w / cols * 0.5, h);
      }
    }

    let running = true;
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('load', resize);

    if (FG.reduce) { running = true; draw(0, 0); running = false; return; }
    FG.onTick(draw);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((es) => { running = es[0].isIntersecting; }, { threshold: 0 }).observe(canvas);
    }
  }

  FG.hero = { init };
})();
