<template>
  <div class="app-root">
    <div class="stage" aria-hidden="true"></div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <div class="grain" aria-hidden="true"></div>
  </div>
</template>

<script setup lang="ts">
useHead({ htmlAttrs: { lang: 'en' }, bodyAttrs: { class: 'fg' } })
</script>
