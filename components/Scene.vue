<template>
  <div class="scene-wrap" v-html="svg" />
</template>

<script setup lang="ts">
const props = defineProps<{ type: string; variant?: string; uid: string }>()
const s = useScenes()
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
</script>
