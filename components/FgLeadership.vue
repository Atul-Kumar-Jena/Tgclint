<template>
  <section class="section leadership" data-theme="dark">
    <div class="container">
      <div class="leadership__head">
        <p class="eyebrow">Leadership</p>
        <h2 class="h2" data-split style="margin-top:1rem">The people<br>who answer for it.</h2>
      </div>
      <div class="leadership__grid">
        <article v-for="(p, i) in site.leadership" :key="p.name" class="leader glass reveal" :style="`--i:${i}`">
          <div class="leader__portrait">
            <FgImg :src="url(PHOTO[p.photo])" :alt="p.name" ratio="1 / 1.12" :fallback="p.name.split(' ').map(w => w[0]).join('')" />
          </div>
          <div class="leader__body">
            <h3 class="leader__name">{{ p.name }}</h3>
            <p class="leader__role">{{ p.role }}</p>
            <p class="leader__bio">{{ p.bio }}</p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const site = useSite()
const { PHOTO, url } = usePhotos()
</script>
