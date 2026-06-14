<template>
  <section ref="root" class="stories" data-theme="dark">
    <!-- marketing intro above the scroll track -->
    <div class="stories__intro container">
      <div class="stories__intro-head">
        <p class="eyebrow">What our buyers say</p>
        <h2 class="stories__intro-title" data-split>{{ site.ratingCount }} families.<br>One clear promise, kept.</h2>
        <p class="stories__intro-sub reveal">Verified plots, honest paperwork and a team that picks up the phone after handover. <span class="stories__rating-inline"><span class="stars">★★★★★</span> {{ site.rating }} average · {{ site.ratingCount }} reviews</span></p>
      </div>
    </div>

    <div class="stories__track">
      <div class="stories__sticky">
        <div class="container stories__body">
          <!-- header row: counter left, label centre, controls right -->
          <div class="stories__top">
            <p class="stories__counter" aria-live="polite" aria-atomic="true">
              <b>0{{ active + 1 }}</b> / 0{{ site.testimonials.length }}
            </p>
            <p class="eyebrow eyebrow--plain">Client stories</p>
            <div class="stories__controls" role="group" aria-label="Story navigation">
              <button class="stories__btn stories__btn--prev" type="button" aria-label="Previous story" @click="go(-1)">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M11 4L6 9l5 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
              <div class="stories__dots" role="tablist" aria-label="Go to story">
                <button
                  v-for="(_, i) in site.testimonials"
                  :key="i"
                  class="stories__dot"
                  :class="{ 'is-active': i === active }"
                  type="button"
                  role="tab"
                  :aria-selected="i === active"
                  :aria-label="`Story ${i + 1}`"
                  @click="jumpTo(i)"
                />
              </div>
              <button class="stories__btn stories__btn--next" type="button" aria-label="Next story" @click="go(1)">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M7 4l5 5-5 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
            </div>
          </div>

          <div class="stories__stage">
            <figure v-for="(t, i) in site.testimonials" :key="i" class="story" :data-active="i === active ? '' : null" :data-prev="i < active ? '' : null">
              <span class="story__stars" aria-hidden="true">{{ '★'.repeat(t.rating || 5) }}</span>
              <blockquote class="story__quote">{{ t.quote }}</blockquote>
              <figcaption class="story__by">
                <span class="story__avatar">
                  <span class="story__initials" aria-hidden="true">{{ t.initials }}</span>
                  <FgImg v-if="t.photo" class="story__photo" :src="url(PHOTO[t.photo])" :alt="t.name" />
                </span>
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
const { PHOTO, url } = usePhotos()
const active = ref(0)
const root = ref<HTMLElement | null>(null)
const { $ScrollTrigger } = useNuxtApp() as any
const n = site.testimonials.length
let trig: any
let userInteracted = false

function jumpTo(i: number) {
  userInteracted = true
  active.value = Math.max(0, Math.min(n - 1, i))
  setTimeout(() => { userInteracted = false }, 2000)
}
function go(dir: number) { jumpTo((active.value + dir + n) % n) }

onMounted(() => {
  const ST = $ScrollTrigger
  if (!ST || !root.value) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const track = root.value.querySelector('.stories__track')
  trig = ST.create({
    trigger: track, start: 'top top', end: 'bottom bottom', scrub: true,
    onUpdate: (self: any) => {
      if (userInteracted) return
      active.value = Math.max(0, Math.min(n - 1, Math.floor(self.progress * n - 1e-4)))
    }
  })
})
onBeforeUnmount(() => { if (trig) trig.kill() })
</script>

<style scoped>
/* marketing intro */
.stories__intro {
  padding-top: clamp(3.5rem, 8vh, 7rem);
  padding-bottom: clamp(1.5rem, 4vh, 3rem);
  text-align: center;
}
.stories__intro-title {
  font-size: clamp(2rem, 1.2rem + 3.8vw, 4.4rem);
  font-weight: 500; line-height: 1.08; letter-spacing: -.025em;
  margin: 1.2rem auto 0; max-width: 22ch; text-wrap: balance;
}
.stories__intro-sub {
  margin: 1.4rem auto 0; max-width: 52ch;
  color: var(--ink-inv-soft); font-size: var(--fs-lead); line-height: 1.4;
}
.stories__rating-inline {
  display: inline-flex; align-items: center; gap: .45rem;
  white-space: nowrap;
}
.stories__rating-inline .stars { color: var(--accent-warm); letter-spacing: .12em; }

/* body: keep enough room for stage without overlap */
.stories__body { display: flex; flex-direction: column; gap: 0; }

/* controls in header row */
.stories__controls {
  display: flex; align-items: center; gap: .6rem;
}
.stories__btn {
  width: 40px; height: 40px; border-radius: 50%;
  display: grid; place-items: center; flex: none;
  background: rgba(255,255,255,.08);
  border: 1px solid rgba(255,255,255,.14);
  color: var(--ink-inv);
  transition: background .3s var(--ease), transform .3s var(--ease);
}
.stories__btn:hover { background: rgba(255,255,255,.18); transform: scale(1.08); }
.stories__btn:active { transform: scale(.94); transition-duration: .12s; }
.stories__btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }

.stories__dots {
  display: flex; align-items: center; gap: .45rem;
}
.stories__dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: rgba(255,255,255,.28);
  border: none; padding: 0; flex: none;
  transition: background .35s var(--ease), transform .35s var(--ease), width .35s var(--ease);
  cursor: pointer;
}
.stories__dot.is-active {
  background: var(--accent-warm);
  width: 22px; border-radius: 4px; transform: none;
}
.stories__dot:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
</style>
