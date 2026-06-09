<template>
  <div class="page-shell">
    <section class="section" data-theme="light" style="padding-top:clamp(8rem,18vh,14rem)">
      <div class="container">
        <div class="contact-grid">
          <div class="contact-grid__intro">
            <p class="eyebrow">Contact</p>
            <h1 class="lede__title" data-split style="text-align:left;margin:1.2rem 0 0">Let's build something<br>exceptional together.</h1>
            <p class="lede__copy reveal" style="margin-left:0;text-align:left">Tell us about your project and we'll follow up with a detailed proposal. For live builds and urgent enquiries, call the studio directly.</p>
            <div class="contact-cta reveal"><Btn label="Get a quote" variant="dark" quote /><Btn label="All projects" to="/projects" variant="ghost" /></div>
          </div>
          <div class="contact-grid__cards reveal">
            <div class="contact-card"><h3>Call</h3><a :href="site.phoneHref" data-hover>{{ site.phone }}</a></div>
            <div class="contact-card"><h3>Email</h3><a :href="site.emailHref" data-hover>{{ site.email }}</a></div>
            <div class="contact-card"><h3>Studio</h3><address>{{ site.address.join(', ') }}</address></div>
            <div class="contact-card"><h3>Hours</h3><p>Mon–Fri, 9–6<br>Showroom by appointment</p></div>
          </div>
        </div>
      </div>
    </section>

    <FgCta />
  </div>
</template>

<script setup lang="ts">
const site = useSite()
usePageMotion()
useHead({ title: `Contact — ${site.brand}` })
</script>
