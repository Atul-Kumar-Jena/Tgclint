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
  phone: '+91 92373 84023',
  phoneHref: 'tel:+919237384023',
  whatsapp: 'https://wa.me/919237384023',
  email: 'info@saansud.com',
  emailHref: 'mailto:info@saansud.com',
  address: ['Saansud Infra Private Limited', 'OU-305, Esplanade One, Rasulgarh', 'Bhubaneswar 751010, Odisha, India'],
  copyright: '© 2025 Official Website of Saansud Infra Private Limited. | All Rights Reserved.',
  termsHref: 'https://saansud.com/terms-and-conditions.html',
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
    { slug: 'mne-jagatsinghpur', name: 'MNE — Jagatsinghpur', location: 'Jagatsinghpur, Odisha', year: 'Active', scene: 'cottage', tags: ['Development'], summary: 'An active Saansud Infra development in Jagatsinghpur district. Layout, pricing and registration details are available from the team.', intro: 'MNE carries the same promise as every Saansud site: verified land, planned infrastructure and paperwork you can read before you commit.', facts: [['Project', 'MNE'], ['District', 'Jagatsinghpur'], ['Status', 'Active'], ['Details', 'On request']], story: ['Jagatsinghpur is home ground for many of our buyers — and for us. We develop here the way we would for our own families: infrastructure first, documents open.', 'Call the team or book a weekend visit, and walk the site with the people who are building it.'] },
    { slug: 'iit-bhubaneswar', name: 'IIT — Bhubaneswar', location: 'Bhubaneswar, Odisha', year: 'Active', scene: 'moor', tags: ['Development'], summary: 'A Saansud Infra project in Bhubaneswar — details, drawings and timelines available on request from our Rasulgarh office.', intro: 'In the capital, the brief is precision: tight sites, exact approvals, careful neighbours. IIT is run from our corporate office a short drive away.', facts: [['Project', 'IIT'], ['City', 'Bhubaneswar'], ['Status', 'Active'], ['Details', 'On request']], story: ['City projects are won on coordination — approvals, utilities, access and sequencing managed daily by a dedicated engineer.', 'Visit our Esplanade One office and the team will take you through the drawings, the schedule and the site itself.'] }
  ] as Project[],
  interiorSolutions: [
    { title: 'Space Planning', copy: 'Modern workspace layouts designed to improve productivity and aesthetics.' },
    { title: 'Interior Designing', copy: 'Elegant and functional interior concepts tailored to your lifestyle.' },
    { title: 'Home Decoration', copy: 'Decor elements and styling that enhance beauty and comfort.' }
  ],
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
  blogIntro: 'Practical, conversion-focused guidance for homeowners who want to avoid costly construction mistakes and build with confidence.',
  news: [
    {
      slug: 'sasta-ru-hinasta-trap',
      image: 'blog/card-sasta-hinasta.webp',
      category: 'Home Construction Odisha | Bhubaneswar House Cost',
      title: 'The "Sasta ru Hinasta" Trap: Why Self-Building Your Home is a Costly Illusion',
      excerpt: 'Trying to self-manage labor may seem cheaper, but hidden leakages in material, time, and stress often push homeowners far over budget.',
      body: [
        'In Odisha, there is a saying deeply rooted in everyday life: "Sasta ru Hinasta" — save a little today, pay a lot tomorrow.',
        'When it comes to home construction, this is not just a saying – it is a reality many homeowners discover the hard way. What begins as an attempt to reduce cost by managing labor and materials often turns into a cycle of inefficiency, stress, and unexpected expenses.',
        'Building a home is not just about bricks and cement. It is about planning, sequencing, execution discipline, and quality control. Without these, even small mistakes multiply into large financial losses.'
      ],
      compare: {
        title: 'Self-Build vs Professional Execution',
        a: { label: 'Self-Building', points: ['No structured planning', 'Scattered accountability', 'Frequent rework', 'High wastage', 'Unpredictable costs', 'High stress levels'] },
        b: { label: 'Saansud Infra', points: ['End-to-end planning', 'Centralized accountability', 'Optimized material usage', 'Strict quality checks', 'Transparent pricing', 'Timely delivery'] }
      }
    },
    {
      slug: 'hidden-health-cost',
      image: 'blog/card-hidden-cost.webp',
      category: 'Best Construction Company Odisha | Residential Construction Tips',
      title: 'The Hidden Health Cost of Building a House: Why Your Peace of Mind is Worth More Than a Discount',
      excerpt: 'The real cost of self-build is not just money, it is decision fatigue, work disruption, and avoidable health stress over months.',
      body: [] as string[]
    },
    {
      slug: 'land-into-landmark',
      image: 'blog/card-land-landmark.webp',
      category: 'Trusted Builders in Odisha | Home Construction Guarantee',
      title: 'Transforming Land into a Landmark: The Foundation of Trust at Saansud Infra',
      excerpt: 'Learn how structural warranty, quality checks, and culture-rooted design turn a plot into a long-term family legacy.',
      body: [] as string[]
    }
  ]
}

export const useSite = () => site
