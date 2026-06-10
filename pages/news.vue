<template>
  <div class="page-shell">
    <section class="section lede" data-theme="light" style="padding-top:clamp(8rem,18vh,14rem)">
      <div class="container">
        <p class="eyebrow">Blog</p>
        <h1 class="lede__title" data-split>Latest blog posts.</h1>
        <p class="lede__copy reveal">{{ site.blogIntro }}</p>
      </div>
    </section>

    <section class="section" data-theme="light" style="padding-top:clamp(2rem,5vh,4rem)">
      <div class="container">
        <div class="news-list">
          <NuxtLink v-for="(n, i) in site.news" :key="n.slug" class="news-item reveal" :to="`/news/${n.slug}`" :style="`--i:${i}`" data-hover>
            <span class="news-item__cat">{{ n.category }}</span>
            <h3 class="news-item__title">{{ n.title }}</h3>
            <p class="news-item__excerpt">{{ n.excerpt }}</p>
            <span class="news-item__more">Read full story</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <FgCta label="Contact us" to="/contact" />
  </div>
</template>

<script setup lang="ts">
const site = useSite()
usePageMotion()
useHead({ title: `Blog — ${site.brand}` })
</script>
