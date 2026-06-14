<template>
  <section class="section awards" :data-theme="theme">
    <div class="container">
      <div v-if="!compact" class="awards__head">
        <p class="eyebrow">Recognition</p>
        <h2 class="h2" data-split style="margin-top:1rem">Awarded for the<br>way we build.</h2>
      </div>

      <div v-if="!compact" class="awards__grid">
        <figure v-for="(a, i) in site.awards" :key="a.image" class="award glass reveal" :style="`--i:${i}`">
          <div class="award__img"><FgImg :src="mu.award(a.image)" :alt="a.title" ratio="4 / 3" /></div>
          <figcaption class="award__cap"><span class="award__title">{{ a.title }}</span><span class="award__org">{{ a.org }}</span></figcaption>
        </figure>
      </div>

      <div class="media-strip reveal">
        <p class="media-strip__label">As featured in</p>
        <ul class="media-strip__names">
          <li v-for="m in site.media" :key="m.name">{{ m.name }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ compact?: boolean; theme?: string }>(), { compact: false, theme: 'light' })
const site = useSite()
const mu = useMediaUrl()
</script>

<style scoped>
.media-strip__names {
  display: flex; flex-wrap: wrap; align-items: center; justify-content: center;
  gap: clamp(1.4rem, 4vw, 3rem); list-style: none;
}
.media-strip__names li {
  font-family: var(--font-display, inherit); font-weight: 600; letter-spacing: -.01em;
  font-size: clamp(1rem, 1.3vw, 1.35rem); color: var(--fg-soft, var(--ink-soft));
  opacity: .72; transition: opacity .4s var(--ease);
}
.media-strip__names li:hover { opacity: 1; }
</style>
