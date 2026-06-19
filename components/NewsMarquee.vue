<template>
  <section class="newsrail" data-theme="dark">
    <div class="newsrail__head container">
      <div class="newsrail__head-text">
        <p class="eyebrow">From the journal</p>
        <h2 class="h2" data-split>The stories behind<br>every Saansud address.</h2>
      </div>
      <NuxtLink to="/news" class="newsrail__all" data-hover>Read all insights&nbsp;&#8599;</NuxtLink>
    </div>

    <!-- never-ending rail: the list is duplicated so the loop is seamless -->
    <div class="newsrail__viewport">
      <div class="newsrail__track">
        <NuxtLink
          v-for="(post, i) in loopItems"
          :key="i"
          :to="post.slug ? `/news/${post.slug}` : '/news'"
          class="newsrail__card"
          data-hover
          :aria-hidden="i >= items.length ? 'true' : undefined"
          :tabindex="i >= items.length ? -1 : undefined"
        >
          <div class="newsrail__media"><FgImg :src="url(post.image)" :alt="post.title" eager /></div>
          <div class="newsrail__body">
            <span class="newsrail__cat">{{ (post.category || 'Insight').split('|')[0].trim() }}</span>
            <h3 class="newsrail__title">{{ post.title }}</h3>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const site = useSite()
const { url } = usePhotos()
const items = computed(() => ((site as any).news || []) as any[])
const loopItems = computed(() => [...items.value, ...items.value])
</script>
