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

    <section class="section" data-theme="light">
      <div class="container">
        <div class="project-intro">
          <div class="project-intro__lead">
            <p class="reveal">{{ project.intro }}</p>
            <div class="project-tags reveal"><span v-for="t in project.tags" :key="t">{{ t }}</span></div>
          </div>
          <dl class="project-intro__facts facts reveal">
            <div v-for="f in project.facts" :key="f[0]" class="fact"><dt>{{ f[0] }}</dt><dd>{{ f[1] }}</dd></div>
          </dl>
        </div>
      </div>
    </section>

    <section class="section" data-theme="light" style="padding-top:0">
      <div class="container">
        <div class="project-duo">
          <div class="project-media reveal clip-reveal" data-parallax-wrap><div data-parallax><Scene type="interior" :variant="project.scene === 'moor' ? 'moor' : 'day'" :uid="`pi-${project.slug}`" /></div></div>
          <div class="project-media reveal clip-reveal" data-parallax-wrap><div data-parallax><Scene type="detail" :variant="project.scene" :uid="`pd-${project.slug}`" /></div></div>
        </div>
      </div>
    </section>

    <section class="section" data-theme="light">
      <div class="container">
        <div class="project-story">
          <p class="eyebrow" style="margin-bottom:1.4rem">The build</p>
          <p v-for="(s, i) in project.story" :key="i">{{ s }}</p>
        </div>
      </div>
    </section>

    <NuxtLink class="project-next" :to="`/projects/${next.slug}`" data-theme="dark" data-hover data-cursor="explore">
      <div style="position:absolute;inset:0"><Scene type="house" :variant="next.scene" :uid="`pn-${next.slug}`" /></div>
      <div class="project-next__veil" />
      <div class="project-next__inner container"><p class="project-next__label">Next project</p><p class="project-next__name">{{ next.name }}</p></div>
    </NuxtLink>
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
