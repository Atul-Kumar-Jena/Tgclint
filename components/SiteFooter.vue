<template>
  <footer class="footer" data-theme="dark">
    <div class="container">
      <div class="footer__top">
        <div>
          <NuxtLink class="logo footer__logo" to="/" aria-label="Saansud Infra — home"><Logo /><span>{{ site.brand }}</span></NuxtLink>
          <div class="footer__socials" style="margin-top:1.4rem">
            <a v-for="s in site.socials" :key="s.label" :href="s.href" target="_blank" rel="noopener" :aria-label="s.label">{{ s.short }}</a>
          </div>
        </div>
        <p class="footer__line reveal">{{ site.tagline }}</p>
      </div>
      <div class="footer__grid footer__grid--2col">
        <div class="footer__contact reveal">
          <p class="footer__label">Reach us</p>
          <a :href="site.phoneHref" data-hover>{{ site.phone }}</a>
          <a :href="site.emailHref" data-hover>{{ site.email }}</a>
          <a class="footer__wa" :href="site.whatsapp" target="_blank" rel="noopener" data-hover>Let's connect on WhatsApp</a>
          <address>{{ site.address.join(', ') }}</address>
        </div>
        <div class="footer__contact reveal" style="--i:1">
          <p class="footer__label">Projects</p>
          <NuxtLink v-for="p in site.projects" :key="p.slug" :to="`/projects/${p.slug}`" data-hover>{{ p.name }}</NuxtLink>
        </div>
      </div>
      <div class="footer__base">
        <p>{{ site.copyright }}</p>
        <div class="footer__legal">
          <a :href="site.termsHref" target="_blank" rel="noopener" data-hover>Terms &amp; Conditions</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const site = useSite()
</script>
