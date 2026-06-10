<template>
  <div class="page-shell">
    <section class="section lede" data-theme="light" style="padding-top:clamp(8rem,18vh,14rem);padding-bottom:clamp(2.5rem,6vh,5rem)">
      <div class="container">
        <p class="eyebrow">{{ post.category }}</p>
        <h1 class="article__title" data-split>{{ post.title }}</h1>
        <p class="article__lead reveal">{{ post.excerpt }}</p>
      </div>
    </section>

    <section class="section" data-theme="light" style="padding-top:0">
      <div class="container">
        <div class="article">
          <template v-if="post.body && post.body.length">
            <p v-for="(p, i) in post.body" :key="i" class="article__p reveal" :style="`--i:${i}`">{{ p }}</p>
          </template>
          <p v-else class="article__p reveal">The full story is being brought across to the new site. In the meantime, our team will happily walk you through it in person — or on a site visit.</p>

          <div v-if="post.compare" class="article__compare reveal">
            <h2 class="article__h2">{{ post.compare.title }}</h2>
            <div class="compare">
              <div class="compare__col compare__col--a">
                <p class="compare__label">{{ post.compare.a.label }}</p>
                <ul><li v-for="pt in post.compare.a.points" :key="pt">{{ pt }}</li></ul>
              </div>
              <div class="compare__col compare__col--b">
                <p class="compare__label">{{ post.compare.b.label }}</p>
                <ul><li v-for="pt in post.compare.b.points" :key="pt">{{ pt }}</li></ul>
              </div>
            </div>
          </div>

          <div class="article__cta reveal">
            <Btn label="Get a quote" variant="dark" quote />
            <Btn label="All posts" to="/news" variant="ghost" />
          </div>
        </div>
      </div>
    </section>

    <NuxtLink class="article__next" :to="`/news/${next.slug}`" data-theme="dark" data-hover>
      <div class="container">
        <p class="article__next-label">Next post</p>
        <p class="article__next-title">{{ next.title }}</p>
      </div>
    </NuxtLink>

    <FgCta label="Contact us" to="/contact" />
  </div>
</template>

<script setup lang="ts">
const site = useSite()
const route = useRoute()
const slug = computed(() => String(route.params.slug))
const post = site.news.find((n) => n.slug === slug.value)
if (!post) throw createError({ statusCode: 404, statusMessage: 'Post not found' })
const idx = site.news.findIndex((n) => n.slug === post!.slug)
const next = site.news[(idx + 1) % site.news.length]
usePageMotion()
useHead({ title: `${post!.title} — ${site.brand}` })
</script>
