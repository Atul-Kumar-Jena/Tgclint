<template>
  <div class="page-shell">
    <section class="section lede" data-theme="light" style="padding-top:clamp(8rem,18vh,14rem)">
      <div class="container">
        <p class="eyebrow">Client stories</p>
        <h1 class="lede__title" data-split>The people who trusted us<br>with their plot — and their home.</h1>
        <p class="lede__copy reveal">{{ site.rating }} average from {{ site.ratingCount }} families. Honest paperwork, infrastructure built first, and a team that answers the phone long after handover.</p>
      </div>
    </section>

    <section class="section" data-theme="light" style="padding-top:clamp(1rem,3vh,2rem)">
      <div class="container">
        <div class="reviews">
          <figure v-for="(t, i) in site.testimonials" :key="i" class="review card reveal" :style="`--i:${i}`">
            <span class="review__stars" aria-hidden="true">{{ '★'.repeat(t.rating || 5) }}</span>
            <blockquote class="review__quote">{{ t.quote }}</blockquote>
            <figcaption class="review__by">
              <span class="review__avatar">
                <span class="review__initials" aria-hidden="true">{{ t.initials }}</span>
                <FgImg v-if="t.photo" class="review__photo" :src="url(PHOTO[t.photo])" :alt="t.name" />
              </span>
              <span class="review__meta"><span class="review__name">{{ t.name }}</span><span class="review__role">{{ t.role }}</span></span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>

    <FgCta label="Book a site visit" to="/showroom" />
  </div>
</template>

<script setup lang="ts">
const site = useSite()
const { PHOTO, url } = usePhotos()
usePageMotion()
useHead({ title: `Client stories — ${site.brand}` })
</script>
