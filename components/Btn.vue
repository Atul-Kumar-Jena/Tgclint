<template>
  <NuxtLink v-if="to" :to="to" class="btn" :class="`btn--${variant}`" data-hover>
    <span class="btn__icon" aria-hidden="true">&#8618;</span>
    <span class="btn__labels"><span class="btn__label">{{ label }}</span><span class="btn__label" aria-hidden="true">{{ label }}</span></span>
  </NuxtLink>
  <button v-else type="button" class="btn" :class="`btn--${variant}`" data-hover @click="onClick">
    <span class="btn__icon" aria-hidden="true">&#8618;</span>
    <span class="btn__labels"><span class="btn__label">{{ label }}</span><span class="btn__label" aria-hidden="true">{{ label }}</span></span>
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{ label: string; to?: string; variant?: string; quote?: boolean }>()
const variant = props.variant || 'dark'
const openQuote = useOpenQuote()
function onClick() { if (props.quote) openQuote() }
</script>
