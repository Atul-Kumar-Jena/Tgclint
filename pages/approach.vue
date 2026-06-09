<template>
  <div class="page-shell">
    <section class="page-hero page-hero--dark" data-theme="dark">
      <div class="page-hero__media" data-parallax-wrap><div data-parallax><Scene type="blueprint" uid="aphero" /></div></div>
      <div class="page-hero__veil" />
      <div class="page-hero__rail"><div class="container"><div class="hairline" /><p class="eyebrow">Our process</p></div></div>
      <div class="page-hero__inner container">
        <h1 class="page-hero__title" data-split>Considered from<br>the first line.</h1>
        <p class="page-hero__sub reveal">From the first conversation to the final pane, we hold the whole project in view — so the glazing arrives as one calm, deliberate gesture.</p>
      </div>
    </section>

    <section v-for="(s, i) in site.approachSteps" :key="i" class="step" data-theme="dark">
      <div class="step__media reveal">
        <div class="step__card step__card--a" data-parallax-wrap><div data-parallax><Scene v-bind="stepScene(s.scene)" :uid="`stepa-${i}`" /></div></div>
        <div class="step__card step__card--b" data-parallax-wrap><div data-parallax><Scene type="detail" variant="day" :uid="`stepb-${i}`" /></div></div>
      </div>
      <div class="step__text">
        <p class="eyebrow">{{ s.index }}. {{ s.label }}</p>
        <h2 class="step__title" data-split v-html="s.title.join('<br>')" />
        <p class="step__copy reveal">{{ s.body }}</p>
      </div>
    </section>

    <section class="section approach-intro" data-theme="light">
      <div class="container">
        <h2 class="approach-intro__title" data-split>Our broad spectrum of services<br>allows us to oversee every step<br>with care — ensuring quality and a<br>deeper understanding of your project.</h2>
      </div>
    </section>

    <section class="section services-block" data-theme="light">
      <div class="container">
        <p class="eyebrow" style="margin-bottom:clamp(1.5rem,3vw,2.5rem)">What we offer</p>
        <div class="services">
          <div v-for="(s, i) in site.services" :key="s.title" class="svc reveal" :style="`--i:${i}`">
            <h3 class="svc__title">{{ s.title }}</h3>
            <div class="svc__body"><p>{{ s.body }}</p><ul class="svc__points"><li v-for="pt in s.points" :key="pt">{{ pt }}</li></ul></div>
          </div>
        </div>
      </div>
    </section>

    <FgCta label="Contact us" to="/contact" />
  </div>
</template>

<script setup lang="ts">
const site = useSite()
usePageMotion()
useHead({ title: `Approach — ${site.brand}` })
function stepScene(scene: string) {
  if (scene === 'engineering') return { type: 'blueprint' }
  if (scene === 'install') return { type: 'detail', variant: 'dusk' }
  return { type: 'interior', variant: 'day' }
}
</script>
