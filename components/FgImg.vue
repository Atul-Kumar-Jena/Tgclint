<template>
  <span class="fgimg" :class="{ 'is-loaded': loaded, 'is-failed': failed }" :style="ratio ? `aspect-ratio:${ratio}` : ''">
    <img
      v-if="src && !failed" ref="imgEl"
      class="fgimg__el" :src="src" :alt="alt || ''"
      :loading="eager ? 'eager' : 'lazy'" :fetchpriority="eager ? 'high' : 'auto'"
      decoding="async" @load="loaded = true" @error="failed = true">
    <span v-if="failed && fallback" class="fgimg__fallback">{{ fallback }}</span>
  </span>
</template>

<script setup lang="ts">
// Progressive image: neutral skeleton until load, soft fade-in, and a graceful
// text/initials fallback if the file ever fails — never a broken image, no flicker.
const props = defineProps<{ src: string; alt?: string; ratio?: string; eager?: boolean; fallback?: string }>()
const loaded = ref(false)
const failed = ref(false)
// catch images that finished loading before the @load listener attached (cached/fast)
const imgEl = ref<HTMLImageElement | null>(null)
onMounted(() => { if (imgEl.value?.complete) { if (imgEl.value.naturalWidth > 0) loaded.value = true; else failed.value = true } })
</script>

<style scoped>
.fgimg {
  position: relative; display: block; overflow: hidden;
  background: var(--bg-warm-2, #e9e6df);
}
[data-theme="dark"] .fgimg, .scene--photo .fgimg { background: #1b2142; }
.fgimg__el {
  position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
  opacity: 0; transform: scale(1.03);
  transition: opacity .6s var(--ease), transform .9s var(--ease);
}
.fgimg.is-loaded .fgimg__el { opacity: 1; transform: none; }
.fgimg__fallback {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  font-weight: 600; letter-spacing: .04em; color: var(--ink-inv, #f2f0ea);
  background: linear-gradient(135deg, #1b2142, #2b3154); font-size: 1.1em;
}
</style>
