<template>
  <div class="menu" :aria-hidden="!menuOpen" @keydown.esc="menuOpen = false">
    <div class="menu__scrim" @click="menuOpen = false" />
    <div class="menu__panel glass" role="dialog" aria-modal="true" aria-label="Site menu" tabindex="-1">
      <p class="menu__eyebrow">Menu</p>
      <nav class="menu__nav" aria-label="Main menu">
        <NuxtLink v-for="(n, i) in site.nav" :key="n.to" class="menu__link" :style="`--i:${i}`" :to="n.to" @click="menuOpen = false"><span>{{ n.label }}</span></NuxtLink>
      </nav>
      <div class="menu__foot">
        <div class="menu__subs">
          <NuxtLink v-for="n in site.navSecondary" :key="n.to" class="menu__sub" :to="n.to" @click="menuOpen = false">{{ n.label }}</NuxtLink>
        </div>
        <div class="menu__contact">
          <a :href="site.phoneHref" data-hover>{{ site.phone }}</a>
          <a :href="site.emailHref" data-hover>{{ site.email }}</a>
        </div>
      </div>
      <div class="menu__cta"><Btn label="Get a quote" variant="light" quote /></div>
    </div>
    <button class="menu__close" type="button" aria-label="Close menu" @click="menuOpen = false"><span /><span /></button>
  </div>
</template>

<script setup lang="ts">
const site = useSite()
const menuOpen = useMenuOpen()
</script>
