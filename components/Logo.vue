<template>
  <img class="logo-mark" :src="src" alt="Saansud Infra" decoding="async" />
</template>

<script setup lang="ts">
// the real Saansud logo (white lockup) — cropped to the mark so it sits inline
const base = useRuntimeConfig().app.baseURL || '/'
const src = base + 'img/brand/logo-white.webp'
</script>

<style scoped>
.logo-mark {
  height: 1.85em; width: 1.85em;
  object-fit: cover; object-position: center 26%;
  display: block; flex: none;
}
</style>
