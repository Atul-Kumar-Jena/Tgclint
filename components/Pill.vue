<template>
  <nav class="pill glass" :class="{ 'pill--hidden': menuOpen || quoteOpen }" aria-label="Primary" data-pill>
    <NuxtLink class="pill__logo" to="/" aria-label="Fluid Glass — home" data-hover><Logo /></NuxtLink>
    <span class="pill__label">{{ label }}</span>
    <button class="pill__menu" type="button" aria-label="Open menu" @click="menuOpen = true">
      <span class="pill__bars" aria-hidden="true"><i /><i /></span>
    </button>
  </nav>
</template>

<script setup lang="ts">
const route = useRoute()
const site = useSite()
const menuOpen = useMenuOpen()
const quoteOpen = useQuoteOpen()
const label = computed(() => {
  const p = route.path
  if (p === '/') return 'Home'
  const found = [...site.nav, ...site.navSecondary].find((n) => p.startsWith(n.to))
  if (found) return found.label
  if (p.startsWith('/projects') || p.startsWith('/project')) return 'Projects'
  return 'Fluid Glass'
})
</script>
