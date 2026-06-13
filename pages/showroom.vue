<template>
  <div class="page-shell">
    <section class="page-hero page-hero--dark" data-theme="dark">
      <div class="page-hero__media" data-parallax-wrap><div data-parallax><Scene type="interior" variant="coast" uid="shhero" /></div></div>
      <div class="page-hero__veil" />
      <div class="page-hero__rail"><div class="container"><div class="hairline" /><p class="eyebrow">Site visits</p></div></div>
      <div class="page-hero__inner container">
        <h1 class="page-hero__title" data-split>Stand on the land.<br>Walk the site.</h1>
        <p class="page-hero__sub reveal">See the roads, the boundary wall, the drainage and the homes under construction — and talk through your plans with the team, on the ground.</p>
      </div>
    </section>

    <section class="section" data-theme="light">
      <div class="container">
        <div class="intro-2">
          <p class="eyebrow intro-2__eyebrow">Visit us</p>
          <div class="intro-2__body">
            <h2 class="intro-2__title" data-split>Every weekend,<br>by appointment.</h2>
            <p class="intro-2__copy reveal">{{ site.address.join(', ') }}. Project site visits run every weekend, and ongoing construction can be visited with prior intimation — see the quality checks for yourself.</p>
            <div class="reveal" style="margin-top:2rem"><Btn label="Book a visit" variant="dark" quote /></div>
          </div>
        </div>
      </div>
    </section>

    <section class="section" data-theme="light">
      <div class="container">
        <div class="gallery">
          <div class="gallery__item reveal" data-parallax-wrap><div data-parallax><Scene type="interior" variant="coast" uid="g1" /></div></div>
          <div class="gallery__item reveal" data-parallax-wrap><div data-parallax><Scene type="detail" variant="day" uid="g2" /></div></div>
          <div class="gallery__item reveal" data-parallax-wrap><div data-parallax><Scene type="house" variant="cottage" uid="g3" /></div></div>
          <div class="gallery__item reveal" data-parallax-wrap><div data-parallax><Scene type="blueprint" uid="g4" /></div></div>
        </div>
      </div>
    </section>

    <FgCta />
  </div>
</template>

<script setup lang="ts">
const site = useSite()
usePageMotion()
useHead({ title: `Site visits — ${site.brand}` })
</script>
