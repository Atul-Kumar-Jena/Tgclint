// Fluid Glass — Nuxt 3 + Vue 3 + GSAP + Lenis, statically generated for GitHub Pages.
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  ssr: true,
  devtools: { enabled: false },
  app: {
    baseURL: '/Tgclint/',
    buildAssetsDir: '/_nuxt/',
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Fluid Glass — Exceptional glazing for those who build with vision.',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'description', content: 'Fluid Glass designs, engineers and installs exceptional architectural glazing — structural glass, slimline doors, rooflights and bespoke facades for those who build with vision.' },
        { name: 'theme-color', content: '#0f1012' },
        { name: 'color-scheme', content: 'light dark' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/Tgclint/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@400;500;600;700;800&display=swap' }
      ]
    }
  },
  css: ['~/assets/css/index.css'],
  nitro: {
    preset: 'github_pages',
    prerender: {
      crawlLinks: true,
      failOnError: false,
      routes: [
        '/', '/about', '/collection', '/projects', '/approach', '/contact', '/news', '/showroom',
        '/projects/ashmead-barn', '/projects/keepers-cottage', '/projects/sea-breeze', '/projects/rusty-house'
      ]
    }
  }
})
