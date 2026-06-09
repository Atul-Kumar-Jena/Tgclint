<template>
  <aside class="endnav" :class="{ 'is-shown': shown }" :aria-hidden="!shown">
    <div class="endnav__inner">
      <p class="endnav__label" style="--ei:0">Navigate</p>
      <nav class="endnav__links" style="--ei:1" aria-label="End of page">
        <NuxtLink v-for="n in site.nav" :key="n.to" :to="n.to">{{ n.label }}</NuxtLink>
      </nav>
      <div class="endnav__cta" style="--ei:2"><Btn label="Get a quote" variant="light" quote /></div>
      <div class="endnav__foot" style="--ei:3">
        <div class="endnav__contact">
          <a :href="site.phoneHref" data-hover>{{ site.phone }}</a>
          <a :href="site.emailHref" data-hover>{{ site.email }}</a>
        </div>
        <div class="endnav__socials">
          <a v-for="s in site.socials" :key="s.label" :href="s.href" target="_blank" rel="noopener" :aria-label="s.label">{{ s.short }}</a>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
const site = useSite()
const shown = ref(false)
let onScroll: (() => void) | null = null
onMounted(() => {
  if (window.innerWidth <= 1024) return
  onScroll = () => {
    const doc = document.documentElement
    const scrollable = doc.scrollHeight - window.innerHeight
    if (scrollable < window.innerHeight * 0.5) { shown.value = false; return }
    const remaining = scrollable - window.scrollY
    if (!shown.value && remaining < window.innerHeight * 0.9) shown.value = true
    else if (shown.value && remaining > window.innerHeight * 1.3) shown.value = false
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})
onBeforeUnmount(() => { if (onScroll) window.removeEventListener('scroll', onScroll) })
</script>
