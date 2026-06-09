<template>
  <div class="layout">
    <slot />
    <Pill />
    <EndNav />
    <SiteMenu />
    <QuotePanel />
    <CookieBar />
    <GlassCursor />
  </div>
</template>

<script setup lang="ts">
const menuOpen = useMenuOpen()
const quoteOpen = useQuoteOpen()
const nuxtApp = useNuxtApp()
const locked = computed(() => menuOpen.value || quoteOpen.value)
watch(locked, (v) => {
  if (!import.meta.client) return
  document.body.classList.toggle('is-locked', v)
  const l = (nuxtApp as any).$lenis
  if (l) { v ? l.stop() : l.start() }
})
</script>
