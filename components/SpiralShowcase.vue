<template>
  <section ref="root" class="spiral" data-theme="dark" data-spiral>
    <div class="spiral__head container">
      <p class="eyebrow">The portfolio, in motion</p>
      <h2 class="h2" data-split>Every address we build<br>turns on the same axis: trust.</h2>
    </div>

    <div class="spiral__stage">
      <div ref="ring" class="spiral__ring">
        <article v-for="(p, i) in items" :key="p.slug" class="spiral__item">
          <NuxtLink :to="`/projects/${p.slug}`" class="spiral__card" data-hover :data-cursor="'view'">
            <div class="spiral__media"><Scene type="house" :variant="p.scene || p.tint || 'hero'" :uid="`spiral-${i}`" /></div>
            <div class="spiral__meta">
              <span class="spiral__idx">{{ String(i + 1).padStart(2, '0') }}</span>
              <h3 class="spiral__name">{{ p.name }}</h3>
              <span class="spiral__loc">{{ p.location }}</span>
            </div>
          </NuxtLink>
        </article>
      </div>
      <div class="spiral__hint"><span>Scroll to turn the spiral</span></div>
    </div>
  </section>
</template>

<script setup lang="ts">
const site = useSite()
// take up to 8 projects for a full turn; fall back gracefully
const items = computed(() => {
  const list = (site.projects || []) as any[]
  if (list.length >= 6) return list.slice(0, 8)
  // pad by repeating so the ring still reads as a spiral on sparse data
  const out: any[] = []
  let i = 0
  while (out.length < 6 && list.length) { out.push({ ...list[i % list.length] }); i++ }
  return out
})
// motion is wired by the page-level usePageMotion() via the [data-spiral] hook
</script>
