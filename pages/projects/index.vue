<template>
  <div class="page-shell">
    <section class="section lede" data-theme="light" style="padding-top:clamp(8rem,18vh,14rem);padding-bottom:clamp(2rem,5vh,4rem)">
      <div class="container">
        <p class="eyebrow">Our developments</p>
        <h1 class="lede__title" data-split>Real projects, real papers —<br>walk through every one.</h1>
        <p class="lede__copy reveal">From our flagship gated community in Paradeep to the corridors we are surveying next. Scroll to move through the portfolio.</p>
      </div>
    </section>

    <section class="hscroll" data-hscroll data-theme="light">
      <div class="hscroll__sticky">
        <div class="container hscroll__head">
          <p class="eyebrow eyebrow--plain">Portfolio</p>
          <p class="hscroll__count" data-hscroll-count>01 / 0{{ site.projects.length + 1 }}</p>
        </div>
        <div class="container"><div class="hscroll__progress" data-hscroll-progress><span /></div></div>
        <div class="hscroll__viewport">
          <div class="hscroll__track" data-hscroll-track>
            <article v-for="(p, i) in site.projects" :key="p.slug" class="hscroll__panel hscroll__panel--portfolio">
              <NuxtLink :to="`/projects/${p.slug}`" data-hover data-cursor="explore">
                <div class="hscroll__media hscroll__media--tall"><div class="hscroll__layer"><Scene type="house" :variant="p.scene" :uid="`pg-${p.slug}`" /></div></div>
                <div class="hscroll__meta">
                  <div class="hscroll__row"><span>0{{ i + 1 }}</span><span>{{ p.year }}</span></div>
                  <h3 class="hscroll__name">{{ p.name }}</h3>
                  <p class="card__summary">{{ p.location }}</p>
                  <div class="card__tags"><span v-for="t in p.tags" :key="t">{{ t }}</span></div>
                </div>
              </NuxtLink>
            </article>
            <article class="hscroll__panel hscroll__panel--end">
              <div class="hscroll__end"><p class="eyebrow">Your plot next</p><h3 class="hscroll__name">Tell us what<br>you're planning.</h3><Btn label="Contact us" to="/contact" /></div>
            </article>
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
useHead({ title: `Projects — ${site.brand}` })
</script>
