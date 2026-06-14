// Authentic Saansud photography served locally from /public/img (no external CDN).
// The <Scene> component fades these in over the SVG art and falls back to the art
// if a photo ever fails — so the site is photo-driven but never shows a broken image.
const PHOTO: Record<string, string> = {
  // developments / land / homes — real Saansud project renders
  hero: 'projects/mahaveer-enclave.webp',
  barn: 'projects/mahaveer-nagar.webp',
  cottage: 'projects/mahaveer-enclave.webp',
  moor: 'projects/iit-bhubaneswar.webp',
  coast: 'projects/mahaveer-nagar.webp',
  day: 'projects/mahaveer-enclave.webp',
  dusk: 'projects/iit-bhubaneswar.webp',
  // services / products
  doors: 'projects/mahaveer-nagar.webp',
  windows: 'interiors/svc-space-planning.webp',
  additional: 'interiors/svc-interior-designing.webp',
  structural: 'projects/iit-bhubaneswar.webp',
  // interiors — real Saansud interior shots
  'int-day': 'interiors/living-navy-blue.webp',
  'int-coast': 'interiors/living-warm-red.webp',
  'int-moor': 'interiors/bedroom-marble-wall.webp',
  // detail
  detail: 'interiors/tv-wall-walnut.webp',
  // interior service detail imagery
  'int-space': 'interiors/svc-space-planning.webp',
  'int-design': 'interiors/svc-interior-designing.webp',
  'int-decor': 'interiors/svc-home-decoration.webp',
  // testimonial avatars
  'av-padmavati': 'people/avatar-padmavati-choudhury.webp',
  'av-smarak': 'people/avatar-smarak-mahapatra.webp',
  'av-rajendra': 'people/avatar-rajendra-das.webp',
  // leadership portraits
  'ld-sitanshu': 'people/sitanshu-mohapatra.webp',
  'ld-umakanta': 'people/umakanta-parija.webp',
  'ld-prangya': 'people/prangyamayee-panda.webp'
}

// award images resolve straight from /img (used by FgAwards)
export function useMediaUrl() {
  const base = useRuntimeConfig().app.baseURL || '/'
  return { award: (n: string) => `${base}img/awards/${n}.webp` }
}

export function usePhotos() {
  const base = useRuntimeConfig().app.baseURL || '/'
  const url = (path: string) => `${base}img/${path}`
  return { PHOTO, url }
}
