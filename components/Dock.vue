<template>
  <div class="dockzone" :data-state="state" :data-quote="quoteOpen ? '' : null">
    <div class="dock-scrim" @click="closeAll" />
    <nav ref="dockEl" class="dock glass" aria-label="Primary" @keydown.esc="closeAll">
      <div class="dock__drawer">
        <div class="dock__body" :aria-hidden="state === 'pill'" data-lenis-prevent>
          <p class="dock__eyebrow">{{ state === 'end' ? 'Navigate' : 'Menu' }}</p>
          <div class="dock__nav">
            <NuxtLink
              v-for="(n, i) in site.nav"
              :key="n.to"
              class="dock__link"
              :style="`--i:${i}`"
              :to="n.to"
              :exact="n.to === '/'"
              @click="closeAll"
            ><span>{{ n.label }}</span></NuxtLink>
          </div>
          <div class="dock__foot" :style="`--i:${site.nav.length}`">
            <div class="dock__subs">
              <NuxtLink v-for="n in site.navSecondary" :key="n.to" class="dock__sub" :to="n.to" @click="closeAll">{{ n.label }}</NuxtLink>
            </div>
            <div class="dock__contact">
              <a :href="site.phoneHref" data-hover>{{ site.phone }}</a>
              <a :href="site.emailHref" data-hover>{{ site.email }}</a>
            </div>
          </div>
          <div class="dock__cta" :style="`--i:${site.nav.length + 1}`"><Btn label="Get a quote" variant="light" quote /></div>
        </div>
      </div>
      <div class="dock__bar">
        <NuxtLink class="dock__logo" to="/" aria-label="Saansud Infra — home" data-hover @click="closeAll"><Logo /></NuxtLink>
        <span class="dock__label">{{ state === 'pill' ? label : state === 'end' ? 'Navigate' : 'Close' }}</span>
        <button class="dock__toggle" type="button" :aria-expanded="state !== 'pill'" :aria-label="state === 'pill' ? 'Open menu' : 'Close menu'" @click="toggle">
          <span class="dock__bars" aria-hidden="true"><i /><i /></span>
        </button>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
const site = useSite()
const route = useRoute()
const menuOpen = useMenuOpen()
const quoteOpen = useQuoteOpen()
const hold = usePageHold()

const endShown = ref(false)
const suppressEnd = ref(false)
const state = computed(() => (menuOpen.value ? 'menu' : endShown.value ? 'end' : 'pill'))

const label = computed(() => {
  const p = route.path
  if (p === '/') return 'Home'
  const all = [...site.nav.filter((n) => n.to !== '/'), ...site.navSecondary]
  const found = all.find((n) => p.startsWith(n.to))
  if (found) return found.label
  if (p.startsWith('/projects')) return 'Projects'
  return 'Saansud'
})

function closeAll() { menuOpen.value = false; if (endShown.value) { endShown.value = false; suppressEnd.value = true } }
function toggle() {
  if (menuOpen.value) { menuOpen.value = false; return }
  if (endShown.value) { endShown.value = false; suppressEnd.value = true; return }
  menuOpen.value = true
}

// auto-unfold near the end of the page (desktop), with hysteresis so it never flickers
let onScroll: (() => void) | null = null
onMounted(() => {
  onScroll = () => {
    if (menuOpen.value || hold.value) return
    const doc = document.documentElement
    const scrollable = doc.scrollHeight - window.innerHeight
    if (scrollable < window.innerHeight * 0.5) { endShown.value = false; return }
    const remaining = scrollable - window.scrollY
    if (remaining > window.innerHeight * 1.4) suppressEnd.value = false
    if (suppressEnd.value) return
    const openAt = window.innerWidth <= 768 ? 0.55 : 0.85
    if (!endShown.value && remaining < window.innerHeight * openAt) endShown.value = true
    else if (endShown.value && remaining > window.innerHeight * (openAt + 0.5)) endShown.value = false
  }
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => { if (onScroll) window.removeEventListener('scroll', onScroll) })

watch(() => route.path, () => { menuOpen.value = false; endShown.value = false; suppressEnd.value = false })
</script>
