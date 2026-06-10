<template>
  <div class="page-shell">
    <section class="section lede" data-theme="light" style="padding-top:clamp(8rem,18vh,14rem)">
      <div class="container">
        <p class="eyebrow">ଆମ କଥା — Vlogs &amp; insights</p>
        <h1 class="lede__title" data-split>Notes and films from our sites —<br>in Odia, and in English.</h1>
      </div>
    </section>

    <section class="section" data-theme="light" style="padding-top:clamp(2rem,5vh,4rem)">
      <div class="container">
        <div class="news-list">
          <a v-for="(n, i) in site.news" :key="n.slug" class="news-item reveal" href="#" :style="`--i:${i}`" data-hover @click.prevent>
            <span class="news-item__cat">{{ n.category }}<i v-if="n.category === 'Vlog'" class="news-item__play" aria-hidden="true" /></span>
            <h3 class="news-item__or">{{ n.or }}</h3>
            <p class="news-item__title">{{ n.title }}</p>
            <p class="news-item__excerpt">{{ n.excerpt }}</p>
            <time class="news-item__date" :datetime="n.date">{{ fmt(n.date) }}</time>
          </a>
        </div>
      </div>
    </section>

    <FgCta label="Contact us" to="/contact" />
  </div>
</template>

<script setup lang="ts">
const site = useSite()
usePageMotion()
useHead({ title: `Vlogs & insights — ${site.brand}` })
function fmt(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}
</script>
