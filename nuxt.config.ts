// Fluid Glass — Nuxt 3 + Vue 3 + GSAP + Lenis, statically generated for GitHub Pages.
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  ssr: true,
  devtools: { enabled: false },
  app: {
    baseURL: '/Tgclint/',
    buildAssetsDir: '/_nuxt/',
    // page transition is wired with JS hooks on <NuxtPage> in app.vue (stacked-card cover)
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Saansud Infra — Land you can build a life on.',
      script: [{
        // runs before first paint: gates the loader + pre-reveal hidden states on JS being
        // available, and force-reveals everything if the app never boots (chunk failure etc).
        innerHTML: "document.documentElement.classList.add('js');setTimeout(function(){var d=document.documentElement;if(!d.classList.contains('gsap'))d.classList.add('js-fallback')},6000)"
      }],
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'description', content: 'Saansud Infra develops approved residential plots, gated communities and quality construction across Odisha — with transparency, trust and care from site selection to registry and beyond.' },
        { name: 'theme-color', content: '#12172f' },
        { name: 'color-scheme', content: 'light dark' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/Tgclint/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@400;500;600;700&family=Archivo:wght@500..800&display=swap' }
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
        '/projects/laxmi-narayan-vihar', '/projects/mne-jagatsinghpur', '/projects/iit-bhubaneswar',
        '/news/sasta-ru-hinasta-trap', '/news/hidden-health-cost', '/news/land-into-landmark'
      ]
    }
  }
})
