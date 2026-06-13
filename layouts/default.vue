<template>
  <div class="layout">
    <slot />
    <Dock />
    <QuotePanel />
    <CookieBar />
    <GlassCursor />
  </div>
</template>

<script setup lang="ts">
const menuOpen = useMenuOpen()
const quoteOpen = useQuoteOpen()
const hold = usePageHold()
const nuxtApp = useNuxtApp()
const locked = computed(() => menuOpen.value || quoteOpen.value)
watch(locked, (v) => {
  if (!import.meta.client) return
  document.body.classList.toggle('is-locked', v)
  const l = (nuxtApp as any).$lenis
  if (!l) return
  // never restart smooth scroll mid page-transition; onAfterEnter restarts it
  if (v) l.stop()
  else if (!hold.value) l.start()
})
</script>
