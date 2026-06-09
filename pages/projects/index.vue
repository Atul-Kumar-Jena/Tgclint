<template>
  <div class="page-shell">
    <section class="section lede" data-theme="light" style="padding-top:clamp(8rem,18vh,14rem)">
      <div class="container">
        <p class="eyebrow">Featured projects</p>
        <h1 class="lede__title" data-split>Named builds, real craft —<br>each one a study in light.</h1>
        <p class="lede__copy reveal">A selection of recent work across the UK. From a frameless Cotswold gable to a walk-on glass floor set into the moor, every project began with a question about light.</p>
      </div>
    </section>

    <section class="section" data-theme="light">
      <div class="container">
        <div class="projects__grid">
          <NuxtLink v-for="(p, i) in site.projects" :key="p.slug" class="card card--project reveal" :to="`/projects/${p.slug}`" data-hover data-cursor="explore" :style="`--i:${i % 2}`">
            <div class="card__media card__media--tall" data-parallax-wrap><div data-parallax><Scene type="house" :variant="p.scene" :uid="`pg-${p.slug}`" /></div><span class="card__cursor" aria-hidden="true">View project</span></div>
            <div class="card__row"><h3 class="card__title">{{ p.name }}</h3><span class="card__index">{{ p.year }}</span></div>
            <div class="card__tags"><span v-for="t in p.tags" :key="t">{{ t }}</span></div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <FgCta label="Contact us" to="/contact" />
  </div>
</template>

<script setup lang="ts">
const site = useSite()
usePageMotion()
useHead({ title: `Projects — ${site.brand}` })
</script>
