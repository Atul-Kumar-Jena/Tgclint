<template>
  <section class="section cta" data-theme="light">
    <div class="container">
      <h2 class="cta__title" data-split>Where vision meets<br>execution</h2>
      <div class="cta__buttons reveal">
        <Btn v-if="to" :label="label || 'Our approach'" :to="to" variant="ghost" />
        <Btn label="Get a quote" variant="dark" quote />
      </div>
    </div>
    <div class="cta__reveal" data-pavilion>
      <div class="cta__pin"><Scene type="pavilion" uid="pav" /></div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{ label?: string; to?: string }>()
</script>
