<template>
  <section id="awards" class="section awards" :data-theme="theme">
    <div class="container">
      <div v-if="!compact" class="awards__head">
        <p class="eyebrow">Recognition</p>
        <h2 class="h2" data-split style="margin-top:1rem">Awarded for the<br>way we build.</h2>
      </div>

      <div v-if="!compact" class="awards__grid">
        <figure v-for="(a, i) in site.awards" :key="a.image" class="award reveal" :style="`--i:${i}`">
          <div class="award__frame">
            <div class="award__img-wrap">
              <FgImg :src="mu.award(a.image)" :alt="a.title" ratio="4 / 3" />
            </div>
            <div class="award__overlay" aria-hidden="true" />
          </div>
          <figcaption class="award__cap">
            <span class="award__title">{{ a.title }}</span>
            <span class="award__org">{{ a.org }}</span>
          </figcaption>
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
.awards__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(1.1rem, 2vw, 1.8rem);
}
.award {
  border-radius: 18px;
  overflow: hidden;
  background: var(--bg-warm-2, #e9e6df);
  border: 1px solid var(--local-line, var(--line, rgba(24,26,42,.14)));
  transition: transform .5s var(--ease), box-shadow .5s var(--ease);
}
.award:hover { transform: translateY(-6px); box-shadow: 0 30px 60px rgba(0,0,0,.14); }

/* contained frame with consistent aspect ratio and muted treatment */
.award__frame {
  position: relative;
  overflow: hidden;
  aspect-ratio: 4 / 3;
  background: #1b1e2a;
}
.award__img-wrap {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
}
.award__img-wrap :deep(.fgimg) { width: 100%; height: 100%; }
.award__img-wrap :deep(.fgimg__el) {
  object-fit: contain;
  padding: 1.2rem;
  /* desaturate slightly so clipart images look curated rather than loud */
  filter: saturate(.72) brightness(.88) contrast(1.08);
  transition: filter .5s var(--ease), transform .6s var(--ease);
}
.award:hover .award__img-wrap :deep(.fgimg__el) {
  filter: saturate(.9) brightness(.96) contrast(1.05);
  transform: scale(1.04);
}

/* subtle dark vignette to ground the image in the card */
.award__overlay {
  position: absolute; inset: 0; pointer-events: none;
  background:
    radial-gradient(ellipse 80% 55% at 50% 100%, rgba(8,9,18,.48), transparent 70%),
    linear-gradient(180deg, rgba(8,9,18,.06) 0%, rgba(8,9,18,.0) 40%);
}

.award__cap {
  display: flex; flex-direction: column; gap: .2rem;
  padding: .9rem 1.1rem 1rem;
  border-top: 1px solid var(--local-line, rgba(24,26,42,.1));
}
.award__title {
  font-weight: 600;
  font-size: clamp(.9rem, 1vw, 1.05rem);
  letter-spacing: -.01em;
  color: var(--fg, var(--ink));
}
.award__org {
  color: var(--local-muted, var(--muted));
  font-size: .78rem;
  letter-spacing: .04em;
  text-transform: uppercase;
}

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

@media (max-width: 900px) { .awards__grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 560px) { .awards__grid { grid-template-columns: 1fr; } }
</style>
