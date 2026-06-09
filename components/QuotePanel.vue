<template>
  <aside class="quote" :aria-hidden="!quoteOpen" @keydown.esc="quoteOpen = false">
    <div class="quote__scrim" @click="quoteOpen = false" />
    <div class="quote__panel" role="dialog" aria-modal="true" aria-label="Get a quote" tabindex="-1">
      <div class="quote__sidebar" aria-hidden="true"><span class="quote__sidebar-word">Glass</span></div>
      <div class="quote__content">
        <button class="quote__close" type="button" aria-label="Close" @click="quoteOpen = false"><span /><span /></button>
        <header class="quote__head">
          <h2 class="quote__title">Get a quote</h2>
          <p class="quote__intro">Share your plans and we'll follow up with a detailed proposal.</p>
        </header>
        <form v-if="!done" class="quote__form" novalidate @submit.prevent="submit">
          <div class="quote__field">
            <label class="quote__lead" for="q-name">Tell us about your project.</label>
            <div class="quote__grid">
              <input id="q-name" v-model="name" type="text" placeholder="Full name" autocomplete="name" :style="nameErr ? 'border-color:#b4543f' : ''">
              <input id="q-email" v-model="email" type="email" placeholder="Email address" autocomplete="email" :style="emailErr ? 'border-color:#b4543f' : ''">
              <input type="text" placeholder="Project location" autocomplete="off">
              <input type="tel" placeholder="Phone (optional)" autocomplete="tel">
            </div>
          </div>
          <fieldset class="quote__field quote__chips">
            <legend class="quote__legend">Required services</legend>
            <label class="chip"><input type="checkbox" value="Glazing"><span>Glazing</span></label>
            <label class="chip"><input type="checkbox" value="Support"><span>Support &amp; aftercare</span></label>
            <label class="chip"><input type="checkbox" value="Other"><span>Other</span></label>
          </fieldset>
          <div class="quote__field">
            <label class="quote__legend" for="q-msg">How can we help?</label>
            <textarea id="q-msg" rows="5" placeholder="A few words about the build, the timeline and the vision&hellip;" />
          </div>
          <div class="quote__submit">
            <button class="btn btn--dark" type="submit" data-hover>
              <span class="btn__icon" aria-hidden="true">&#8618;</span>
              <span class="btn__labels"><span class="btn__label">Send enquiry</span><span class="btn__label" aria-hidden="true">Send enquiry</span></span>
            </button>
            <p class="quote__note">We reply to every enquiry within two working days.</p>
          </div>
        </form>
        <p v-else class="quote__done">Thank you — your enquiry is on its way. We'll be in touch shortly.</p>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
const quoteOpen = useQuoteOpen()
const name = ref(''); const email = ref(''); const done = ref(false)
const nameErr = ref(false); const emailErr = ref(false)
function submit() {
  nameErr.value = !name.value.trim()
  emailErr.value = !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)
  if (!nameErr.value && !emailErr.value) done.value = true
}
</script>
