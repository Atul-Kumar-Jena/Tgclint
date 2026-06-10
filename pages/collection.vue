<template>
  <div class="page-shell">
    <section class="section lede" data-theme="light" style="padding-top:clamp(8rem,18vh,14rem)">
      <div class="container">
        <p class="eyebrow">Services</p>
        <h1 class="lede__title" data-split>Everything a home needs —<br>design, build, interiors<br>and the land beneath it.</h1>
        <p class="lede__copy reveal">Complete home construction with architectural design, civil, plumbing, electrical, painting, marble and tile, woodwork and modular kitchens — alongside planned plotted communities. Material and labour, one contract, one team.</p>
      </div>
    </section>

    <section class="section" data-theme="light">
      <div class="container">
        <div v-for="(p, i) in site.products" :id="p.key" :key="p.key" class="product-section" :class="{ 'product-section--flip': i % 2 === 1 }">
          <div class="product-section__media reveal" data-parallax-wrap><div data-parallax><Scene type="product" :variant="p.tint" :uid="`coll-${p.key}`" /></div></div>
          <div class="product-section__text">
            <p class="product-section__num">0{{ i + 1 }} — Services</p>
            <h2 class="product-section__title" data-split>{{ p.name }}</h2>
            <p class="product-section__copy reveal">{{ p.summary }}</p>
            <ul class="svc__points" style="margin-top:1.5rem"><li v-for="pt in p.points" :key="pt">{{ pt }}</li></ul>
          </div>
        </div>
      </div>
    </section>

    <FgCta label="All projects" to="/projects" />
  </div>
</template>

<script setup lang="ts">
const site = useSite()
usePageMotion()
useHead({ title: `Services — ${site.brand}` })
</script>
