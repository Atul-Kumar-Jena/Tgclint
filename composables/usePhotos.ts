// Real architectural photography (Unsplash CDN) keyed to each scene.
// The <Scene> component fades these in over the SVG art and falls back to the art
// if a photo ever fails — so the site is photo-driven but never shows a broken image.
// Swap any id for your own licensed shots later.
const PHOTO: Record<string, string> = {
  // developments / land / homes
  barn: '1600585154340-be6161a56a0c',
  cottage: '1512917774080-9991f1c4c750',
  coast: '1499793983690-e29da59ef1c2',
  moor: '1564013799919-ab600027ffc6',
  hero: '1500382017468-9049fed747ef',
  // glazing products
  doors: '1600210492493-0946911123ea',
  windows: '1503387762-592deb58ef4e',
  additional: '1600566753190-17f0baa2a6c3',
  structural: '1486325212027-8081e485255e',
  // interiors
  'int-day': '1600607687939-ce8a6c25118c',
  'int-coast': '1600566752734-2a0cd53d6e0a',
  'int-moor': '1600210492486-724fe5c67fb0',
  // detail
  detail: '1502005229762-cf1b2da7c5d6'
}

export function usePhotos() {
  const url = (id: string, w = 1500) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`
  return { PHOTO, url }
}
