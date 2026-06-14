<template>
  <div class="page-shell">
    <section class="section lede" data-theme="light" style="padding-top:clamp(8rem,18vh,14rem)">
      <div class="container">
        <p class="eyebrow">About {{ site.brand }}</p>
        <h1 class="lede__title" data-split>A construction and plotting company<br>built on an old-fashioned idea —<br>say it clearly, then deliver it.</h1>
        <p class="lede__copy reveal">{{ site.brand }} is a real-estate development and construction company from Odisha. We design and build complete homes, develop planned plotted communities, and stand behind both with documentation, warranties and aftercare.</p>
      </div>
    </section>

    <section class="section" data-theme="light">
      <div class="container">
        <div class="feature feature--flip">
          <div class="feature__text">
            <p class="eyebrow">Who we are</p>
            <h2 class="feature__title" data-split>One accountable team,<br>plot to possession.</h2>
            <p class="feature__copy reveal">Architecture and project management are handled in-house by empanelled architects and dedicated engineers; materials and specialist trades come from trusted partners under our supervision. That single chain of accountability is why our promises hold.</p>
            <p class="feature__copy reveal" style="margin-top:1rem">From a soil test before the first drawing to a warranty after the last coat of paint — the same team answers for all of it.</p>
          </div>
          <div class="feature__media reveal"><div class="feature__frame" data-parallax-wrap><div data-parallax><Scene type="house" variant="cottage" uid="about" /></div></div></div>
        </div>
      </div>
    </section>

    <section class="section section--tight" data-theme="light">
      <div class="container">
        <div class="about-stat">
          <div class="about-stat__item reveal"><div class="about-stat__num">15+</div><div class="about-stat__label">Projects delivered</div></div>
          <div class="about-stat__item reveal" style="--i:1"><div class="about-stat__num">8–10</div><div class="about-stat__label">Months for a G+2 home</div></div>
          <div class="about-stat__item reveal" style="--i:2"><div class="about-stat__num">{{ site.rating }}</div><div class="about-stat__label">Average client review</div></div>
        </div>
      </div>
    </section>

    <section class="section" data-theme="dark">
      <div class="container">
        <p class="eyebrow" style="margin-bottom:clamp(2rem,4vw,3rem)">What we value</p>
        <div class="values">
          <div class="value reveal"><p class="value__num">01</p><h3>Transparency</h3><p>Costs, materials, timelines and documents on the table before you commit. Milestone billing tied to real progress, never the calendar.</p></div>
          <div class="value reveal" style="--i:1"><p class="value__num">02</p><h3>Quality</h3><p>Trusted material brands, cube-tested concrete, daily site inspections and a dedicated engineer on every build.</p></div>
          <div class="value reveal" style="--i:2"><p class="value__num">03</p><h3>Care</h3><p>We remain available after handover — warranty honoured, issues root-caused and repaired, questions answered for years.</p></div>
        </div>
      </div>
    </section>

    <FgLeadership />

    <FgAwards theme="light" />

    <FgCta label="All projects" to="/projects" />
  </div>
</template>

<script setup lang="ts">
const site = useSite()
usePageMotion()
useHead({ title: `About — ${site.brand}` })
</script>
