<template>
  <section class="section cta" data-theme="dark">
    <div class="container">
      <h2 class="cta__title" data-split>From your plot<br>to your front door</h2>
      <div class="cta__buttons reveal">
        <Btn v-if="to" :label="label || 'Our approach'" :to="to" variant="ghost" />
        <Btn label="Get a quote" variant="dark" quote />
      </div>
    </div>
    <div class="cta__reveal" data-pavilion>
      <div class="cta__pin"><Scene type="pavilion" uid="pav" /></div>
    </div>
  </section>
  <SiteFooter />
</template>

<script setup lang="ts">
defineProps<{ label?: string; to?: string }>()
</script>
