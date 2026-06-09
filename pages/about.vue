<template>
  <div class="page-shell">
    <section class="section lede" data-theme="light" style="padding-top:clamp(8rem,18vh,14rem)">
      <div class="container">
        <p class="eyebrow">About {{ site.brand }}</p>
        <h1 class="lede__title" data-split>We bring architecture to life<br>through craft and innovation — for<br>those who demand precision and beauty.</h1>
        <p class="lede__copy reveal">{{ site.brand }} is a structural and architectural glazing studio. We design, engineer, prototype and install exceptional glass for architects and design-led homeowners across the UK.</p>
      </div>
    </section>

    <section class="section" data-theme="light">
      <div class="container">
        <div class="feature feature--flip">
          <div class="feature__text">
            <p class="eyebrow">Who we are</p>
            <h2 class="feature__title" data-split>A studio built<br>around glass.</h2>
            <p class="feature__copy reveal">We started with a simple conviction: that glass deserves the same rigour as steel and the same care as fine joinery. Two decades on, that conviction shapes everything — from the way we draw a junction to the way we protect a site.</p>
            <p class="feature__copy reveal" style="margin-top:1rem">Our workshop in Shoreditch is where ideas are tested at full scale before they ever reach a build.</p>
          </div>
          <div class="feature__media reveal"><div class="feature__frame" data-parallax-wrap><div data-parallax><Scene type="house" variant="cottage" uid="about" /></div></div></div>
        </div>
      </div>
    </section>

    <section class="section section--tight" data-theme="light">
      <div class="container">
        <div class="about-stat">
          <div class="about-stat__item reveal"><div class="about-stat__num">18</div><div class="about-stat__label">Years refining glass</div></div>
          <div class="about-stat__item reveal" style="--i:1"><div class="about-stat__num">240+</div><div class="about-stat__label">Projects delivered</div></div>
          <div class="about-stat__item reveal" style="--i:2"><div class="about-stat__num">{{ site.rating }}</div><div class="about-stat__label">Average client review</div></div>
        </div>
      </div>
    </section>

    <section class="section" data-theme="dark">
      <div class="container">
        <p class="eyebrow" style="margin-bottom:clamp(2rem,4vw,3rem)">What we value</p>
        <div class="values">
          <div class="value reveal"><p class="value__num">01</p><h3>Precision</h3><p>Tolerances measured in fractions of a millimetre. The difference between good and invisible is exactness, repeated.</p></div>
          <div class="value reveal" style="--i:1"><p class="value__num">02</p><h3>Restraint</h3><p>The best glazing is the least you notice. We remove everything that competes with the view and the light.</p></div>
          <div class="value reveal" style="--i:2"><p class="value__num">03</p><h3>Care</h3><p>We treat your site like our studio and your project like our own — from first survey to long after handover.</p></div>
        </div>
      </div>
    </section>

    <FgCta label="All projects" to="/projects" />
  </div>
</template>

<script setup lang="ts">
const site = useSite()
usePageMotion()
useHead({ title: `About — ${site.brand}` })
</script>
