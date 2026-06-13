<template>
  <section ref="root" class="stories" data-theme="dark">
    <div class="stories__track">
      <div class="stories__sticky">
        <div class="container" style="width:100%">
          <div class="stories__top">
            <p class="stories__counter">0{{ active + 1 }} / 0{{ site.testimonials.length }}</p>
            <p class="eyebrow eyebrow--plain">Client stories</p>
            <span class="stories__rating"><span class="stars">★★★★★</span> {{ site.rating }} · {{ site.ratingCount }} reviews</span>
          </div>
          <div class="stories__stage">
            <figure v-for="(t, i) in site.testimonials" :key="i" class="story" :data-active="i === active ? '' : null" :data-prev="i < active ? '' : null">
              <blockquote class="story__quote">{{ t.quote }}</blockquote>
              <figcaption class="story__by">
                <span class="story__avatar" aria-hidden="true">{{ t.initials }}</span>
                <span class="story__meta"><span class="story__name">{{ t.name }}</span><span class="story__role">{{ t.role }}</span></span>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const site = useSite()
const active = ref(0)
const root = ref<HTMLElement | null>(null)
const { $ScrollTrigger } = useNuxtApp() as any
let trig: any
onMounted(() => {
  const ST = $ScrollTrigger
  if (!ST || !root.value) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const track = root.value.querySelector('.stories__track')
  const n = site.testimonials.length
  trig = ST.create({
    trigger: track, start: 'top top', end: 'bottom bottom', scrub: true,
    onUpdate: (self: any) => { active.value = Math.max(0, Math.min(n - 1, Math.floor(self.progress * n - 1e-4))) }
  })
})
onBeforeUnmount(() => { if (trig) trig.kill() })
</script>
