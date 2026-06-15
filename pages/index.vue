<template>
  <div class="page-shell">
    <section class="hero" data-theme="dark">
      <div class="hero__media">
        <Scene type="house" variant="hero" uid="hero" />
        <div class="hero__veil"></div>
        <div class="glass-veil"></div>
      </div>
      <p class="hero__eyebrow eyebrow">Est. 2014 · Bhubaneswar, Odisha</p>
      <div class="hero__inner container">
        <h1 class="hero__title" data-split>Land you can build<br>a life on.</h1>
        <p class="hero__sub reveal">Transparent land development &mdash; plot to possession.</p>
      </div>
      <div class="hero__scroll" aria-hidden="true">Scroll to explore <i /></div>
    </section>

    <section class="section lede" data-theme="light">
      <div class="container">
        <p class="eyebrow">About {{ site.brand }}</p>
        <h2 class="lede__title" data-split>From approved plots to finished homes,<br>we build Odisha's most trusted<br>address — with transparency at every step.</h2>
        <div class="lede__cta reveal"><Btn label="Who we are" to="/about" /></div>
      </div>
    </section>

    <section class="section" data-theme="light">
      <div class="container">
        <div class="feature">
          <div class="feature__text">
            <p class="eyebrow">Our promise</p>
            <h2 class="feature__title" data-split>Checked daily,<br>built to outlast.</h2>
            <p class="feature__copy reveal">A dedicated engineer on every site. Trusted brands for cement, steel, paints and tiles. Cube-tested concrete, milestone-based payments and a warranty that means it — so the home you imagine is the home you get.</p>
            <div class="feature__cta reveal"><Btn label="Our approach" to="/approach" variant="ghost" /></div>
          </div>
          <div class="feature__media reveal">
            <div class="feature__frame" data-parallax-wrap><div data-parallax><Scene type="interior" variant="day" uid="feat" /></div></div>
          </div>
        </div>
      </div>
    </section>

    <section class="section" data-theme="light">
      <div class="container">
        <div class="collection__head">
          <div><p class="eyebrow">What we do</p><h2 class="h2" data-split style="margin-top:1rem">One team, plot to possession.</h2></div>
          <p class="collection__intro reveal">Design, approvals, construction, interiors and planned plotted communities — handled end to end by one accountable team.</p>
        </div>
        <div class="collection__grid">
          <NuxtLink v-for="(p, i) in site.products" :key="p.key" class="card card--product reveal" :to="`/collection#${p.key}`" data-hover data-cursor="explore" :style="`--i:${i}`">
            <div class="card__media" data-parallax-wrap>
              <div data-parallax><Scene type="product" :variant="p.tint" :uid="`prod-${p.key}`" /></div>
              <div class="card__overlay">
                <h3 class="card__title">{{ p.name }}</h3>
                <span class="card__index">0{{ i + 1 }}</span>
              </div>
            </div>
          </NuxtLink>
        </div>
        <div style="margin-top:clamp(2rem,4vw,3rem)" class="reveal"><Btn label="All services" to="/collection" variant="ghost" /></div>
      </div>
    </section>

    <FgStories />

    <section class="section showroom" data-theme="dark">
      <div class="container">
        <div class="showroom__grid">
          <div class="showroom__media reveal clip-reveal" data-parallax-wrap><div data-parallax><Scene type="interior" variant="coast" uid="show" /></div></div>
          <div class="showroom__text">
            <p class="eyebrow">Site visits</p>
            <h2 class="h2" data-split style="margin-top:1rem">Walk the land<br>before you sign.</h2>
            <address class="showroom__addr reveal">{{ site.address.join(', ') }}<br>Site visits every weekend, by appointment</address>
            <div class="reveal"><Btn label="Book a site visit" to="/showroom" variant="light" /></div>
          </div>
        </div>
      </div>
    </section>

    <section class="section proj-list" data-theme="light">
      <div class="container">
        <div class="proj-list__head">
          <p class="eyebrow">Featured Projects</p>
          <h2 class="proj-list__title" data-split>Each project tells<br>its own story.</h2>
          <div class="reveal"><Btn label="All projects" to="/projects" /></div>
        </div>
        <div class="proj-list__table">
          <NuxtLink v-for="(p, i) in site.projects" :key="p.slug" :to="`/projects/${p.slug}`" class="proj-list__row reveal" data-hover>
            <span class="proj-list__num">0{{ i + 1 }}</span>
            <h3 class="proj-list__name">{{ p.name }}</h3>
            <span class="proj-list__loc">{{ p.location }}</span>
            <span class="proj-list__tags">
              <span v-for="t in p.tags.slice(0, 2)" :key="t">{{ t }}</span>
            </span>
            <span class="proj-list__arr" aria-hidden="true">&#8599;</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <FgAwards compact theme="light" />
    <FgCta />
  </div>
</template>

<script setup lang="ts">
const site = useSite()
usePageMotion()
useHead({ title: `${site.brand} — ${site.tagline}` })
</script>
