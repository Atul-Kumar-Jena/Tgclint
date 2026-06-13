<template>
  <ClientOnly>
    <div v-if="visible" class="cookie glass" :data-show="show ? '' : null">
      <p class="cookie__text">We use a few cookies to understand how the site is used. No fuss.</p>
      <div class="cookie__actions">
        <button class="btn btn--mini btn--light" type="button" @click="choose('accepted')">Accept</button>
        <button class="btn btn--mini btn--ghost" type="button" @click="choose('denied')">Deny</button>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
const visible = ref(false)
const show = ref(false)
onMounted(() => {
  let stored: string | null = null
  try { stored = localStorage.getItem('fg-consent') } catch (_) { stored = 'skip' }
  if (stored) return
  visible.value = true
  setTimeout(() => { show.value = true }, 1400)
})
function choose(v: string) {
  try { localStorage.setItem('fg-consent', v) } catch (_) {}
  show.value = false
  setTimeout(() => { visible.value = false }, 500)
}
</script>
