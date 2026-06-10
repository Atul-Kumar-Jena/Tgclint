// Saansud Infra content model (CMS-like). Stand-in for a headless CMS later.
// Contact details and testimonials are placeholders — swap for official ones.
export interface Project {
  slug: string; name: string; location: string; year: string; scene: string;
  tags: string[]; summary: string; intro: string; facts: [string, string][]; story: string[]
}

const site = {
  brand: 'Saansud Infra',
  tagline: 'Land you can build a life on.',
  description: 'Saansud Infra develops approved residential plots, gated communities and quality construction across Odisha — with transparency, trust and care at every step, from site selection to registry and beyond.',
  phone: '+91 99999 00000',
  phoneHref: 'tel:+919999900000',
  email: 'hello@saansud.com',
  emailHref: 'mailto:hello@saansud.com',
  address: ['Saansud Infra Pvt. Ltd.', 'Bhubaneswar, Odisha', 'CIN U41000OD2024PTC045712'],
  rating: '4.9',
  ratingCount: '180+',
  nav: [
    { label: 'About', key: 'about', to: '/about' },
    { label: 'Services', key: 'collection', to: '/collection' },
    { label: 'Projects', key: 'projects', to: '/projects' },
    { label: 'Approach', key: 'approach', to: '/approach' },
    { label: 'Contact', key: 'contact', to: '/contact' }
  ],
  navSecondary: [
    { label: 'Insights', key: 'news', to: '/news' },
    { label: 'Site visits', key: 'showroom', to: '/showroom' }
  ],
  socials: [
    { label: 'Instagram', short: 'IG', href: 'https://instagram.com' },
    { label: 'YouTube', short: 'YT', href: 'https://youtube.com' },
    { label: 'LinkedIn', short: 'LI', href: 'https://linkedin.com' },
    { label: 'Facebook', short: 'FB', href: 'https://facebook.com' }
  ],
  products: [
    { name: 'Home construction', key: 'doors', summary: 'Complete G+2 home construction — civil, plumbing, electrical, painting, marble and tile — delivered in 8–10 months on milestone-based payments.', tint: 'doors', points: ['G+2 in 8–10 months', 'Milestone-based payments', 'Trusted material brands', 'Workmanship warranty'] },
    { name: 'Architecture & design', key: 'windows', summary: 'Empanelled architects turn your plot and vision into 2D plans, 3D walkthroughs and structural engineering that is safe, functional and beautiful.', tint: 'windows', points: ['2D plans & 3D visualisation', 'Structural engineering', 'Soil-test led foundations', 'Permits & approvals'] },
    { name: 'Interiors & renovation', key: 'additional', summary: 'Full interior design and execution — space planning, modular kitchens, woodwork and lighting — plus complete home renovations.', tint: 'additional', points: ['Space planning & decor', 'Modular kitchens', 'Wardrobes & woodwork', 'Full renovations'] },
    { name: 'Plots & communities', key: 'structural', summary: 'Approved residential plots in planned, gated communities — boundary walls, concrete roads, lighting and drainage built before registry.', tint: 'structural', points: ['Approved layouts', 'Clear, verified titles', 'Gated infrastructure', 'Registry assistance'] }
  ],
  projects: [
    { slug: 'laxmi-narayan-vihar', name: 'Laxmi Narayan Vihar', location: 'Paradeep–Kujang Road, Odisha', year: 'Registrations open', scene: 'barn', tags: ['Residential plots', 'Gated community'], summary: 'Our flagship gated community — 59 planned plots over 1.30 lakh sq ft on the Paradeep–Kujang Road, with roads, lighting and amenities built first.', intro: 'Laxmi Narayan Vihar is planned the way we believe every plot project should be: infrastructure first. Concrete roads, boundary wall, street lighting and drainage go in before a single registry is signed.', facts: [['Plots', '59 planned plots'], ['Extent', '1.30 lakh sq ft'], ['Location', 'Paradeep–Kujang Road'], ['Status', 'Registrations open']], story: ['The site sits on a corridor that is growing quickly — near schools, hospitals, banks and the port economy of Paradeep. We chose it for what it will feel like to live there in ten years, not just what it costs today.', 'Inside the wall: tree-lined avenues, walkways, stormwater drainage, a community hall, a kids’ play area, round-the-clock security and a temple at the heart of the layout. Buy a plot, and the neighbourhood is already on its way.'] },
    { slug: 'paradeep-phase-two', name: 'Paradeep — Phase II', location: 'Paradeep, Odisha', year: 'In planning', scene: 'coast', tags: ['Residential plots'], summary: 'The next phase of our Paradeep story — land identified, layout under design. Details to be announced.', intro: 'Following Laxmi Narayan Vihar, Phase II extends the same infrastructure-first promise along the coastal corridor. Layout and approvals are in progress.', facts: [['Stage', 'Layout design'], ['Corridor', 'Paradeep coastal belt'], ['Approach', 'Infrastructure first'], ['Status', 'Announcing soon']], story: ['Every Saansud project begins long before launch — soil, access, drainage and title work are settled first, so what we announce is already real.', 'Register your interest and our team will share the layout, pricing and timelines the moment they are ready.'] },
    { slug: 'jagatsinghpur-enclave', name: 'Jagatsinghpur Enclave', location: 'Jagatsinghpur, Odisha', year: 'Land assembly', scene: 'cottage', tags: ['Gated community'], summary: 'A planned enclave in Jagatsinghpur district — land assembly underway, designed around shade, water and walkable streets.', intro: 'Jagatsinghpur is where many of our buyers grew up. This enclave is being assembled plot by plot, with the masterplan drawn around existing trees and natural drainage.', facts: [['Stage', 'Land assembly'], ['District', 'Jagatsinghpur'], ['Masterplan', 'In design'], ['Status', 'Announcing soon']], story: ['We assemble land slowly and openly — every parcel verified, every seller settled fairly. It takes longer. It is the only way we work.', 'The masterplan keeps the big trees, follows the natural fall of the land for drainage, and reserves the best corner for the community, not the showroom.'] },
    { slug: 'kujang-corridor', name: 'Kujang Corridor Sites', location: 'Kujang, Odisha', year: 'Survey', scene: 'moor', tags: ['Residential plots', 'Investment'], summary: 'Select road-facing sites along the Kujang corridor, under survey for future phases and early-interest registration.', intro: 'The Kujang corridor connects daily life to the port economy. We are surveying select road-facing parcels here for future phases.', facts: [['Stage', 'Survey & diligence'], ['Corridor', 'Kujang'], ['Use', 'Residential / investment'], ['Status', 'Early interest open']], story: ['Corridors reward patience: the right parcel at the right junction, bought clean, held with proper papers, served by real roads.', 'Early-interest buyers see our diligence file before they see a brochure — survey notes, title chain, access and utilities, in plain language.'] }
  ] as Project[],
  testimonials: [
    { quote: 'Every document was on the table before we paid a rupee. The plot, the papers, the road outside — all exactly as promised.', name: 'Pratap Mohanty', role: 'Plot owner, Laxmi Narayan Vihar', initials: 'PM' },
    { quote: 'We visited on a Sunday, walked the boundary, saw the drainage being laid. That honesty is why we registered the same month.', name: 'Sasmita Behera', role: 'Homebuyer, Paradeep', initials: 'SB' },
    { quote: 'I bought from Bangalore without a single worry. Video walkthroughs, clear titles, and the registry done on the promised date.', name: 'Debashis Rout', role: 'NRI investor', initials: 'DR' },
    { quote: 'They built our home on the plot they sold us — one team, one promise, zero excuses. The handover was a festival day.', name: 'Anita Swain', role: 'Construction client, Kujang', initials: 'AS' },
    { quote: 'A young company with old-fashioned values. Transparent pricing, patient answers, and streets you can actually walk on.', name: 'Rakesh Parida', role: 'Plot owner, Jagatsinghpur', initials: 'RP' }
  ],
  services: [
    { title: 'Design & approvals', body: 'Empanelled architects translate your plot and budget into 2D plans, 3D visualisations and structural designs — and we walk the file through every permit and approval from local authorities, so construction starts clean.', points: ['Architectural design', '3D walkthroughs', 'Structural engineering', 'Permits & approvals', 'Soil testing'] },
    { title: 'Construction', body: 'A dedicated engineer and supervisor run every site. Foundations follow the soil report; concrete is cube-tested; progress is inspected daily; payments follow milestones — foundation, structure, finishing — never the calendar.', points: ['Dedicated site engineer', 'Daily quality checks', 'Cube-tested concrete', 'Milestone billing', 'Standard / Premium / Luxury'] },
    { title: 'Interiors & renovation', body: 'Full interior design and execution: space planning, colour schemes, modular kitchens, wardrobes, lighting and decor — plus structural, interior and exterior renovations for homes that deserve a second life.', points: ['Interior design & execution', 'Modular kitchens', 'Woodwork & wardrobes', 'Full renovations'] },
    { title: 'Warranty & aftercare', body: 'Every home leaves with a workmanship warranty and our post-construction support. Seepage, cracks or finishing issues are root-caused and repaired properly — and we stay reachable long after handover.', points: ['Workmanship warranty', 'Post-construction support', 'Root-cause repairs', 'Maintenance guidance'] }
  ],
  approachSteps: [
    { index: '1', label: 'Design & approvals', title: ['Your plot, your vision,', 'drawn to the last beam.'], body: 'We begin with your land and your budget. Our architects develop 2D plans and 3D walkthroughs, engineers size the foundation from a proper soil test, and we secure every permit before a single brick moves.', scene: 'studio' },
    { index: '2', label: 'Construction', title: ['Built by milestones,', 'checked every day.'], body: 'A dedicated engineer supervises daily. Trusted brands for cement, steel, paints and tiles; cube-tested concrete; payments tied to real progress — foundation, structure, finishing — with a schedule you can hold us to.', scene: 'engineering' },
    { index: '3', label: 'Handover & warranty', title: ['Handover is', 'a promise, kept.'], body: 'You move into a finished, documented home — approved plans, certificates and clearances in hand — backed by a workmanship warranty and aftercare that actually answers the phone.', scene: 'install' }
  ],
  news: [
    { slug: 'lnv-registrations-open', title: 'Registrations open at Laxmi Narayan Vihar, Paradeep', date: '2026-04-18', category: 'Projects', excerpt: '59 planned plots over 1.30 lakh sq ft on the Paradeep–Kujang Road — gated, lit, drained and tree-lined. Site visits every weekend.' },
    { slug: 'plot-buyers-checklist', title: 'The plot buyer’s checklist for Odisha', date: '2026-03-02', category: 'Guides', excerpt: 'Title chain, conversion, approvals, access and drainage — the five questions to ask before you fall in love with a piece of land.' },
    { slug: 'construction-packages', title: 'Standard, Premium or Luxury — choosing your build package', date: '2026-01-21', category: 'Guides', excerpt: 'Three finish categories, one promise. What changes between packages — materials, fittings, warranty — and what never does.' },
    { slug: 'development-standards', title: 'Inside our development standards', date: '2025-11-09', category: 'Craft', excerpt: 'What "infrastructure first" actually means at a Saansud site: road sections, wall specs, lighting spacing and drainage falls.' }
  ]
}

export const useSite = () => site
