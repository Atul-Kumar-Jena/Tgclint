// Content model (CMS-like). Stand-in for Storyblok; swap this for @storyblok/nuxt later.
export interface Project {
  slug: string; name: string; location: string; year: string; scene: string;
  tags: string[]; summary: string; intro: string; facts: [string, string][]; story: string[]
}

const site = {
  brand: 'Fluid Glass',
  tagline: 'Exceptional glazing for those who build with vision.',
  description: 'Fluid Glass designs, engineers and installs exceptional architectural glazing — structural glass, slimline doors, rooflights and bespoke facades for those who build with vision.',
  phone: '020 8156 7290',
  phoneHref: 'tel:+442081567290',
  email: 'sales@fluid.glass',
  emailHref: 'mailto:sales@fluid.glass',
  address: ['Fluid Glass Studio', '27 Curtain Road', 'Shoreditch, London EC2A 3LT'],
  rating: '5.0',
  ratingCount: '120+',
  nav: [
    { label: 'About', key: 'about', to: '/about' },
    { label: 'Collection', key: 'collection', to: '/collection' },
    { label: 'Projects', key: 'projects', to: '/projects' },
    { label: 'Approach', key: 'approach', to: '/approach' },
    { label: 'Contact', key: 'contact', to: '/contact' }
  ],
  navSecondary: [
    { label: 'News', key: 'news', to: '/news' },
    { label: 'Showroom', key: 'showroom', to: '/showroom' }
  ],
  socials: [
    { label: 'Instagram', short: 'IG', href: 'https://instagram.com' },
    { label: 'YouTube', short: 'YT', href: 'https://youtube.com' },
    { label: 'LinkedIn', short: 'LI', href: 'https://linkedin.com' },
    { label: 'X', short: 'X', href: 'https://x.com' }
  ],
  products: [
    { name: 'Sliding doors', key: 'doors', summary: 'Minimal-frame sliding and pivot doors that dissolve the line between inside and out.', tint: 'doors', points: ['Slim 20mm sightlines', 'Panels up to 3m tall', 'Flush thresholds', 'Triple-glazed options'] },
    { name: 'Windows', key: 'windows', summary: 'Slimline steel-look and aluminium windows engineered for light, silence and longevity.', tint: 'windows', points: ['Steel-look profiles', 'Concealed fixings', 'Acoustic glazing', 'Heritage-approved'] },
    { name: 'Rooflights', key: 'additional', summary: 'Structural rooflights and lanterns that pour daylight into the heart of a home.', tint: 'additional', points: ['Structural rooflights', 'Walk-on options', 'Ventilated lanterns', 'Self-cleaning glass'] },
    { name: 'Structural glass', key: 'structural', summary: 'Frameless walls, floors, balustrades and walk-on glass with invisible support.', tint: 'structural', points: ['Frameless walls', 'Glass balustrades', 'Walk-on floors', 'Invisible silicone joints'] }
  ],
  projects: [
    { slug: 'ashmead-barn', name: 'Ashmead Barn', location: 'Cotswolds, Gloucestershire', year: '2024', scene: 'barn', tags: ['Sliding doors', 'Structural glass'], summary: 'A working barn reimagined as a family home, wrapped in a frameless glazed gable that frames the valley beyond.', intro: 'Ashmead Barn pairs blackened timber with a fully glazed gable end. The challenge: hold an eight-metre span of glass with no visible structure, then make it disappear into the landscape.', facts: [['Discipline', 'Structural glazing'], ['Span', '8.2 m frameless gable'], ['Glass', 'Triple-laminated, low-iron'], ['Status', 'Completed 2024']], story: ['We began with a single question from the architect — could the gable read as one uninterrupted plane of glass? The answer became a hidden steel moment-frame, carrying the roof so the glazing carries nothing but light.', 'Every junction was prototyped at full scale in our Shoreditch workshop before a single pane reached site. The result is a barn that keeps its agricultural honesty while opening completely to the Cotswold valley.'] },
    { slug: 'keepers-cottage', name: 'Keepers Cottage', location: 'South Downs, West Sussex', year: '2023', scene: 'cottage', tags: ['Windows', 'Rooflights'], summary: 'A heritage cottage extended with a slimline steel-look glazed link and a run of structural rooflights.', intro: 'Listed brick and flint meets a precise, modern glazed link. The brief asked for daylight without compromise to the protected fabric of the original keeper’s cottage.', facts: [['Discipline', 'Windows & rooflights'], ['Glazing', 'Slimline steel-look'], ['Rooflights', '5 structural lanterns'], ['Status', 'Completed 2023']], story: ['The new link had to touch the old cottage as lightly as possible. We detailed shadow-gap reveals so the glass appears to float a few millimetres clear of the historic flint.', 'Overhead, a sequence of structural rooflights tracks the sun across the kitchen, turning a once-dark plan into the brightest room in the house.'] },
    { slug: 'sea-breeze', name: 'Sea Breeze', location: 'Salcombe, Devon', year: '2024', scene: 'coast', tags: ['Sliding doors', 'Windows'], summary: 'A cliff-edge house with corner-opening sliding walls engineered to take Atlantic weather without a visible frame.', intro: 'On an exposed Devon headland, the glazing has to survive salt and storm while feeling weightless on a calm summer evening. Sea Breeze balances both.', facts: [['Discipline', 'Sliding doors'], ['Corner', 'Frameless opening corner'], ['Rating', 'Marine-grade, PAS 24'], ['Status', 'Completed 2024']], story: ['The opening corner is the heart of the house — two sliding walls that meet with no post, so the living room steps straight onto the terrace and the sea.', 'Behind the scenes sit marine-grade gaskets, thermally broken profiles and laminated low-iron glass, all tuned to a coast that rarely sits still.'] },
    { slug: 'rusty-house', name: 'Rusty House', location: 'Peak District, Derbyshire', year: '2022', scene: 'moor', tags: ['Structural glass', 'Rooflights'], summary: 'A weathering-steel house set into the moor, with a walk-on glass floor that lights the level below.', intro: 'Corten steel and structural glass, set against millstone grit. Rusty House is an exercise in letting daylight travel through the building, floor to floor.', facts: [['Discipline', 'Structural glass'], ['Feature', 'Walk-on glass floor'], ['Glass', 'Anti-slip laminated'], ['Status', 'Completed 2022']], story: ['A walk-on glass floor draws daylight from the upper terrace down into a lower studio cut into the hillside — an invisible skylight you can stand on.', 'The detailing disappears into the corten so the eye reads only steel, stone and a quiet sheet of glass underfoot.'] }
  ] as Project[],
  testimonials: [
    { quote: 'Fluid Glass made the impossible feel routine. The frameless gable is the first thing every visitor notices and the last thing they can explain.', name: 'Eleanor Hartley', role: 'Principal, Hartley Studio', initials: 'EH' },
    { quote: 'Precision you can feel. Every junction was resolved before it reached site, and the install was the calmest week of the whole build.', name: 'Marcus Bell', role: 'Director, Bell & Co Architects', initials: 'MB' },
    { quote: 'They treat glass like a structural material and a luxury finish at the same time. Rare to find both in one team.', name: 'Priya Anand', role: 'Architect, Anand Workshop', initials: 'PA' },
    { quote: 'Our clients wanted light without limits. Fluid Glass delivered a corner that opens to the sea and shuts out the storm.', name: 'Tom Whitfield', role: 'Whitfield Residential', initials: 'TW' },
    { quote: 'The most considered glazing partner we have worked with. Calm, exact, and genuinely invested in the architecture.', name: 'Sofia Reyes', role: 'Reyes + Partners', initials: 'SR' }
  ],
  services: [
    { title: 'Insights & strategy', body: 'We help you lay the foundation for your project by defining the right glazing approach from the very start. Together we explore your architectural goals, technical requirements and the potential to create truly exceptional spaces — aligning budget, design intent and function before moving forward.', points: ['Budget advice', 'Quotation preparation', 'Initial design advice', 'Project planning', 'Technical advice'] },
    { title: 'Glazing design', body: 'We bring your vision to life by developing precise, detailed glazing designs — drawings, specifications and technical solutions tailored to your project. With on-site surveys and close collaboration, we ensure the design integrates seamlessly into your architecture, both aesthetically and structurally.', points: ['Detailed drawings', 'Structural calculations', 'On-site survey', 'Specification & glass selection'] },
    { title: 'Manufacture & craft', body: 'Every system is prototyped and prepared in our own workshop. We test the hard junctions at full scale before anything reaches site, so the parts that look effortless are the ones we have already solved twice.', points: ['Full-scale prototyping', 'In-house fabrication', 'Quality control', 'Pre-assembly'] },
    { title: 'Installation & aftercare', body: 'Our trained installation teams treat your site like our studio. After handover we stay close, with maintenance guidance and a responsive aftercare service that protects the investment for years to come.', points: ['Specialist installation', 'Handover & training', 'Maintenance plans', 'Responsive aftercare'] }
  ],
  approachSteps: [
    { index: '1', label: 'Design phase', title: ['You imagine,', 'we make it real.'], body: 'Once the quotation is approved, we begin by listening to your vision and understanding the story you want to create. We study your drawings and explore the best solutions to bring that vision to life — balancing aesthetics, performance and precision.', scene: 'studio' },
    { index: '2', label: 'Engineering', title: ['We solve it', 'before you see it.'], body: 'Our engineers resolve every load path, junction and tolerance in advance. Structural calculations, thermal modelling and full-scale prototyping turn an ambitious drawing into something that can actually be built — quietly, and on time.', scene: 'engineering' },
    { index: '3', label: 'Installation', title: ['The hard part,', 'made to look easy.'], body: 'Specialist teams install with the same care we design with. We protect your site, sequence the lift, and set each pane to fractions of a millimetre — so the finished glazing reads as one calm, deliberate gesture.', scene: 'install' }
  ],
  news: [
    { slug: 'ashmead-barn-wins', title: 'Ashmead Barn shortlisted for the Structural Glass Award', date: '2024-11-12', category: 'Studio', excerpt: 'Our eight-metre frameless gable in the Cotswolds has been recognised among this year’s most ambitious glazing projects.' },
    { slug: 'low-iron-glass', title: 'Why we specify low-iron glass as standard', date: '2024-09-30', category: 'Craft', excerpt: 'The faint green tint of ordinary float glass is invisible — until it isn’t. A short note on clarity, and why it matters at scale.' },
    { slug: 'shoreditch-showroom', title: 'Our Shoreditch showroom is now open by appointment', date: '2024-07-18', category: 'Studio', excerpt: 'Touch the systems, see the junctions, and talk through your project with the team — in a space built to show glass at its best.' },
    { slug: 'thermal-performance', title: 'Slimline frames and the thermal performance question', date: '2024-05-04', category: 'Technical', excerpt: 'Thin sightlines and warm rooms are not opposites. How thermally broken profiles let you have both.' }
  ]
}

export const useSite = () => site
