<template>
  <div class="page-shell">
    <section class="project-hero" data-theme="dark">
      <div class="project-hero__media" data-parallax-wrap><div data-parallax><Scene type="house" :variant="project.scene" :uid="`ph-${project.slug}`" /></div></div>
      <div class="project-hero__veil" />
      <div class="project-hero__inner container">
        <div class="project-hero__meta"><span>{{ project.location }}</span><span>{{ project.year }}</span></div>
        <h1 class="project-hero__title" data-split>{{ project.name }}</h1>
      </div>
    </section>

    <!-- the project reads sideways: a minimal pinned side-scroll, fluid.glass style -->
    <section class="hscroll" data-hscroll data-theme="dark">
      <div class="hscroll__sticky">
        <div class="container hscroll__head">
          <p class="eyebrow eyebrow--plain">The project</p>
          <p class="hscroll__count" data-hscroll-count>01 / 07</p>
        </div>
        <div class="container"><div class="hscroll__progress" data-hscroll-progress><span /></div></div>
        <div class="hscroll__viewport">
          <div class="hscroll__track" data-hscroll-track>
            <article class="hscroll__panel hscroll__panel--text">
              <p class="hscroll__lead">{{ project.intro }}</p>
              <div class="card__tags" style="margin-top:1.4rem"><span v-for="t in project.tags" :key="t">{{ t }}</span></div>
            </article>
            <article class="hscroll__panel hscroll__panel--facts">
              <dl class="facts">
                <div v-for="f in project.facts" :key="f[0]" class="fact"><dt>{{ f[0] }}</dt><dd>{{ f[1] }}</dd></div>
              </dl>
            </article>
            <article class="hscroll__panel">
              <div class="hscroll__media"><div class="hscroll__layer"><Scene type="interior" :variant="project.scene === 'moor' ? 'moor' : 'day'" :uid="`pi-${project.slug}`" /></div></div>
            </article>
            <article class="hscroll__panel hscroll__panel--text">
              <p class="hscroll__story">{{ project.story[0] }}</p>
            </article>
            <article class="hscroll__panel">
              <div class="hscroll__media"><div class="hscroll__layer"><Scene type="detail" :variant="project.scene" :uid="`pd-${project.slug}`" /></div></div>
            </article>
            <article class="hscroll__panel hscroll__panel--text">
              <p class="hscroll__story">{{ project.story[1] }}</p>
            </article>
            <article class="hscroll__panel hscroll__panel--end">
              <NuxtLink class="hscroll__next" :to="`/projects/${next.slug}`" data-hover data-cursor="explore">
                <div class="hscroll__media">
                  <div class="hscroll__layer"><Scene type="house" :variant="next.scene" :uid="`pn-${next.slug}`" /></div>
                  <div class="hscroll__cap">
                    <div class="hscroll__row"><span>Next</span><span>{{ next.year }}</span></div>
                    <h3 class="hscroll__name">{{ next.name }}</h3>
                    <p class="hscroll__loc">{{ next.location }}</p>
                  </div>
                </div>
              </NuxtLink>
            </article>
          </div>
        </div>
      </div>
    </section>

    <FgCta label="All projects" to="/projects" />
  </div>
</template>

<script setup lang="ts">
const site = useSite()
const route = useRoute()
const slug = computed(() => String(route.params.slug))
const project = site.projects.find((p) => p.slug === slug.value)
if (!project) throw createError({ statusCode: 404, statusMessage: 'Project not found' })
const idx = site.projects.findIndex((p) => p.slug === project!.slug)
const next = site.projects[(idx + 1) % site.projects.length]
usePageMotion()
useHead({ title: `${project!.name} — ${site.brand}` })
</script>
