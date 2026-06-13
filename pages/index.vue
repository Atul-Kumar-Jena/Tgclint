<template>
  <div class="page-shell">
    <header class="topbar">
      <NuxtLink class="topbar__brand" to="/" aria-label="Saansud Infra — home"><Logo /><span>{{ site.brand }}</span></NuxtLink>
      <div class="topbar__quote"><Btn label="Get a quote" variant="ghost" quote /></div>
    </header>

    <section class="hero" data-theme="dark">
      <div class="hero__media">
        <Scene type="house" variant="hero" uid="hero" />
        <div class="hero__veil" />
        <svg class="hero__silhouette" viewBox="0 0 1440 220" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
          <path d="M0 180 Q 120 150 240 168 T 480 160 T 720 172 T 960 156 T 1200 170 T 1440 158 L1440 220 L0 220Z" fill="#0a0c16" opacity=".8" />
          <g fill="none" stroke="rgba(246,138,74,.35)" stroke-width="1.2"><path d="M560 175 L560 120 L700 96 L840 120 L840 175" /><path d="M600 120 L600 175 M680 108 L680 175 M760 110 L760 175" /></g>
          <path d="M560 175 L560 120 L700 96 L840 120 L840 175Z" fill="rgba(240,104,30,.12)" />
        </svg>
      </div>
      <div class="hero__inner container">
        <h1 class="hero__title" data-split>Land you can build<br>a life on.</h1>
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
            <div class="card__media" data-parallax-wrap><div data-parallax><Scene type="product" :variant="p.tint" :uid="`prod-${p.key}`" /></div></div>
            <div class="card__row"><h3 class="card__title">{{ p.name }}</h3><span class="card__index">0{{ i + 1 }}</span></div>
            <p class="card__summary">{{ p.summary }}</p>
          </NuxtLink>
        </div>
        <div style="margin-top:clamp(2rem,4vw,3rem)" class="reveal"><Btn label="All services" to="/collection" variant="ghost" /></div>
      </div>
    </section>

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

    <section class="hscroll" data-hscroll data-theme="dark">
      <div class="hscroll__sticky">
        <div class="container hscroll__head">
          <p class="eyebrow">Featured projects</p>
          <p class="hscroll__count" data-hscroll-count>01 / 0{{ site.projects.length + 1 }}</p>
        </div>
        <div class="container"><div class="hscroll__progress" data-hscroll-progress><span /></div></div>
        <div class="hscroll__viewport">
          <div class="hscroll__track" data-hscroll-track>
            <article v-for="(p, i) in site.projects" :key="p.slug" class="hscroll__panel hscroll__panel--portfolio">
              <NuxtLink :to="`/projects/${p.slug}`" data-hover data-cursor="explore">
                <div class="hscroll__media">
                  <div class="hscroll__layer"><Scene type="house" :variant="p.scene" :uid="`hs-${p.slug}`" /></div>
                  <div class="hscroll__cap">
                    <div class="hscroll__row"><span>0{{ i + 1 }}</span><span>{{ p.location }}</span></div>
                    <h3 class="hscroll__name">{{ p.name }}</h3>
                    <div class="card__tags"><span v-for="t in p.tags" :key="t">{{ t }}</span></div>
                  </div>
                </div>
              </NuxtLink>
            </article>
            <article class="hscroll__panel hscroll__panel--end">
              <div class="hscroll__end"><p class="eyebrow">All developments</p><h3 class="hscroll__name">Explore every<br>project.</h3><Btn label="All projects" to="/projects" variant="light" /></div>
            </article>
          </div>
        </div>
      </div>
    </section>

    <FgStories />
    <FgCta />
  </div>
</template>

<script setup lang="ts">
const site = useSite()
usePageMotion()
useHead({ title: `${site.brand} — ${site.tagline}` })
</script>
