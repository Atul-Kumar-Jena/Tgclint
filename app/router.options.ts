import type { RouterConfig } from '@nuxt/schema'

// Scrolling is owned by the page transition in app.vue: the reset happens at the
// exact frame the incoming card covers the viewport. The router must not also
// scroll (it would visibly yank the old page at navigation start).
export default <RouterConfig>{
  scrollBehavior: () => false
}
