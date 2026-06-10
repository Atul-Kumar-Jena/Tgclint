<template>
  <div class="page-shell">
    <section class="section" data-theme="light" style="padding-top:clamp(8rem,18vh,14rem)">
      <div class="container">
        <div class="contact-grid">
          <div class="contact-grid__intro">
            <p class="eyebrow">Contact</p>
            <h1 class="lede__title" data-split style="text-align:left;margin:1.2rem 0 0">Let's build your<br>address together.</h1>
            <p class="lede__copy reveal" style="margin-left:0;text-align:left">Tell us about your plot, your budget and your dream home — we'll come back with a clear plan and an honest estimate. For site visits and urgent queries, call us directly.</p>
            <div class="contact-cta reveal">
              <Btn label="Get a quote" variant="dark" quote />
              <a class="btn btn--wa" :href="site.whatsapp" target="_blank" rel="noopener" data-hover>
                <span class="btn__icon" aria-hidden="true">&#10148;</span>
                <span class="btn__labels"><span class="btn__label">Let's connect</span><span class="btn__label" aria-hidden="true">Let's connect</span></span>
              </a>
            </div>
          </div>
          <div class="contact-grid__cards reveal">
            <div class="contact-card"><h3>Call</h3><a :href="site.phoneHref" data-hover>{{ site.phone }}</a></div>
            <div class="contact-card"><h3>Email</h3><a :href="site.emailHref" data-hover>{{ site.email }}</a></div>
            <div class="contact-card"><h3>Office</h3><address>{{ site.address.join(', ') }}</address></div>
            <div class="contact-card"><h3>Hours</h3><p>Mon–Sat, 9–6<br>Site visits by appointment</p></div>
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
