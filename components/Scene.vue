<template>
  <div v-if="src" class="scene scene--photo">
    <span class="scene__svg" v-html="svg" />
    <img class="scene__img" :class="{ 'is-loaded': loaded }" :src="src" :alt="alt || ''" :loading="eager ? 'eager' : 'lazy'" :fetchpriority="eager ? 'high' : 'auto'" decoding="async" @load="loaded = true" @error="src = ''">
  </div>
  <div v-else class="scene-wrap" v-html="svg" />
</template>

<script setup lang="ts">
const props = defineProps<{ type: string; variant?: string; uid: string; alt?: string }>()
const s = useScenes()
const { PHOTO, url } = usePhotos()

const svg = computed(() => {
  switch (props.type) {
    case 'house': return s.house(props.variant || 'day', props.uid)
    case 'interior': return s.interior(props.variant || 'day', props.uid)
    case 'detail': return s.detail(props.variant || 'day', props.uid)
    case 'blueprint': return s.blueprint(props.uid)
    case 'product': return s.product(props.variant || 'doors', props.uid)
    case 'pavilion': return s.pavilion()
    default: return ''
  }
})

function photoKey() {
  if (props.type === 'house') return props.variant || 'barn'
  if (props.type === 'product') return props.variant || 'doors'
  if (props.type === 'interior') return 'int-' + (props.variant || 'day')
  if (props.type === 'detail') return 'detail'
  return ''
}
const id = PHOTO[photoKey()]
const src = ref(id ? url(id) : '')
const loaded = ref(false)
// hero is above the fold — load it immediately (eager + high priority) so it is
// already painted when the first-load curtain lifts
const eager = props.uid === 'hero'
</script>
