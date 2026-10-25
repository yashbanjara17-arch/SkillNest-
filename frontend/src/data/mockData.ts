import { Freelancer, Project, User } from '../types';
import { 
  categoryTechDesign, 
  categoryLocalBusiness, 
  featuredTeamShowcase, 
  heroMarketplace 
} from '../assets/images';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-client-1',
    name: 'Aniket Patil',
    email: 'aniket@cafepalms.in',
    role: 'client',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    location: 'Boisar, Palghar Dist.',
    organization: 'Cafe Palms & Bistro Boisar',
    bio: 'Founder of Cafe Palms, looking for local digital partners to upgrade our online presence and loyalty system.',
    status: 'Active',
    joinedDate: '2025-11-10',
    phone: '+91 98234 11223'
  },
  {
    id: 'user-free-1',
    name: 'Rahul Sharma',
    email: 'rahul.dev@skillnest.local',
    role: 'freelancer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    location: 'Boisar (Near Railway Station)',
    organization: 'Independent Full-Stack Developer',
    bio: 'Full-stack web and mobile developer with 5+ years building software for local MSMEs and startups in Maharashtra.',
    status: 'Active',
    joinedDate: '2025-10-04',
    phone: '+91 98765 43210'
  },
  {
    id: 'user-team-1',
    name: 'PixelCraft Studio',
    email: 'contact@pixelcraftstudio.in',
    role: 'freelancer',
    avatar: 'https://images.unsplash.com/photo-152207182399e-b89e7df830c5?w=150&auto=format&fit=crop&q=80',
    location: 'Palghar West',
    organization: 'PixelCraft Digital Collective (3 Members)',
    bio: 'A 3-member boutique design and frontend development team specializing in branding, local store ecommerce, and modern websites.',
    status: 'Active',
    joinedDate: '2025-12-18',
    phone: '+91 91234 56789'
  },
  {
    id: 'user-admin-1',
    name: 'Saurabh Mehta',
    email: 'admin@skillnest.local',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    location: 'Boisar HQ, Maharashtra',
    organization: 'SkillNest Platform Administration',
    bio: 'Regional community lead and platform administrator overseeing Boisar and Palghar operations.',
    status: 'Active',
    joinedDate: '2025-09-01',
    phone: '+91 99000 11222'
  }
];

export const INITIAL_FREELANCERS: Freelancer[] = [
  {
    id: 'fl-1',
    name: 'Rahul Sharma',
    headline: 'Senior Full-Stack Web & Mobile App Developer',
    bio: 'Over 5 years of software engineering experience. Specializes in building modern React web apps, fast mobile ordering systems, and inventory tools for shops and factories in the Boisar-Tarapur industrial corridor.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    location: 'Boisar, Palghar Dist.',
    areaName: 'Boisar',
    distanceFromBoisarKm: 1.5,
    isTeam: false,
    hourlyRateInr: 950,
    startingProjectRateInr: 18000,
    rating: 4.9,
    reviewCount: 24,
    availability: 'Available Immediately',
    experienceYears: 5,
    category: 'Web & App Development',
    skills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Mobile Apps'],
    languages: ['Marathi', 'Hindi', 'English'],
    verifiedLocal: true,
    completedProjectsCount: 38,
    contactPreference: 'Phone & WhatsApp',
    portfolio: [
      {
        id: 'port-1',
        title: 'Tarapur Steel Forge Inventory Dashboard',
        description: 'Real-time raw material and dispatch tracker for an MIDC manufacturer with barcode scanning and automated daily Excel export.',
        imageUrl: categoryTechDesign,
        category: 'Web Application',
        completionYear: '2025',
        clientType: 'Manufacturing MSME',
        skillsUsed: ['React', 'TypeScript', 'PostgreSQL', 'Tailwind CSS'],
        liveUrl: 'https://demo-tarapur-steel.app'
      },
      {
        id: 'port-2',
        title: 'Bhoomi Organic Farm Delivery Portal',
        description: 'Direct-to-consumer farm produce store with WhatsApp order notifications and UPI payment gateway.',
        imageUrl: categoryLocalBusiness,
        category: 'E-Commerce',
        completionYear: '2025',
        clientType: 'Local Agriculture Brand',
        skillsUsed: ['Next.js', 'Tailwind CSS', 'Razorpay', 'WhatsApp API']
      }
    ],
    services: [
      {
        id: 'srv-1',
        title: 'Custom Local Business Website (Responsive + SEO)',
        description: 'Complete high-performance website tailored for local restaurants, healthcare clinics, or service providers.',
        startingPriceInr: 18000,
        deliveryTimeDays: 7
      },
      {
        id: 'srv-2',
        title: 'Inventory / Workflow Web App for Factories & Shops',
        description: 'Database-backed business tool to replace manual paper logs and messy spreadsheets.',
        startingPriceInr: 35000,
        deliveryTimeDays: 14
      }
    ],
    reviews: [
      {
        id: 'rev-1',
        clientName: 'Sanjay Deshmukh',
        clientCompany: 'Deshmukh Agro Industries, Palghar',
        clientLocation: 'Palghar',
        rating: 5,
        date: '2026-02-14',
        comment: 'Rahul visited our Palghar office, understood the factory dispatch bottleneck in 30 minutes, and delivered our portal a week ahead of schedule.',
        projectTitle: 'Factory Dispatch Portal'
      },
      {
        id: 'rev-2',
        clientName: 'Dr. Neha Varma',
        clientCompany: 'Varma Dental Care',
        clientLocation: 'Boisar',
        rating: 5,
        date: '2026-01-20',
        comment: 'Very professional and responsive. He set up our patient appointment booking smoothly and taught our clinic staff how to use it.',
        projectTitle: 'Clinic Appointment System'
      }
    ]
  },
  {
    id: 'fl-2',
    name: 'PixelCraft Studio',
    headline: 'Boutique Creative & Frontend Collective (3 Members)',
    bio: 'We are a close-knit trio of a brand designer, UI/UX specialist, and frontend engineer based in Palghar. We build identity systems, product catalogs, and high-converting websites for retail shops and educational institutes.',
    avatar: 'https://images.unsplash.com/photo-152207182399e-b89e7df830c5?w=300&auto=format&fit=crop&q=80',
    location: 'Palghar West (Station Road)',
    areaName: 'Palghar',
    distanceFromBoisarKm: 12.0,
    isTeam: true,
    teamSize: 3,
    teamMembers: ['Tanvi Kulkarni (Art Director)', 'Aditya Rao (UI/UX)', 'Sumit More (Frontend)'],
    hourlyRateInr: 1400,
    startingProjectRateInr: 25000,
    rating: 4.95,
    reviewCount: 31,
    availability: 'Available Immediately',
    experienceYears: 4,
    category: 'UI/UX & Graphic Design',
    skills: ['Figma', 'Brand Identity', 'UI/UX Design', 'Tailwind CSS', 'Packaging Design', 'React'],
    languages: ['Marathi', 'English', 'Hindi'],
    verifiedLocal: true,
    completedProjectsCount: 46,
    contactPreference: 'In-person Meeting First',
    portfolio: [
      {
        id: 'port-3',
        title: 'Konkan Agro Spice Branding & Retail Packaging',
        description: 'Complete brand packaging, pouch labels, and retail shelf display design for Dahanu farm collective.',
        imageUrl: categoryLocalBusiness,
        category: 'Branding & Packaging',
        completionYear: '2025',
        clientType: 'FMCG Food Producer',
        skillsUsed: ['Figma', 'Illustrator', 'Print Design']
      },
      {
        id: 'port-4',
        title: 'Saraswati Academy Mobile-First Portal',
        description: 'Clean admission landing page and course prospectus portal with 400+ seasonal student sign-ups.',
        imageUrl: featuredTeamShowcase,
        category: 'UI/UX & Web',
        completionYear: '2025',
        clientType: 'Coaching Institute',
        skillsUsed: ['UI/UX', 'Figma', 'Tailwind CSS']
      }
    ],
    services: [
      {
        id: 'srv-3',
        title: 'Complete Brand Identity Kit (Logo, Colors, Stationery)',
        description: 'Custom logo design, typography guidelines, visiting cards, bills, and social media template bundle.',
        startingPriceInr: 22000,
        deliveryTimeDays: 8
      },
      {
        id: 'srv-4',
        title: 'High-Converting Business Website & UI Design',
        description: 'End-to-end Figma prototype converted into mobile-responsive code ready for production.',
        startingPriceInr: 32000,
        deliveryTimeDays: 12
      }
    ],
    reviews: [
      {
        id: 'rev-3',
        clientName: 'Kishore Mhatre',
        clientCompany: 'Mhatre Seafoods, Dahanu',
        clientLocation: 'Dahanu',
        rating: 5,
        date: '2026-03-01',
        comment: 'The PixelCraft team came to our processing unit in Dahanu. The brand logo and export cartons they designed helped us secure three major restaurant contracts in Mumbai.',
        projectTitle: 'Export Brand Packaging'
      }
    ]
  },
  {
    id: 'fl-3',
    name: 'Pooja Naik',
    headline: 'Social Media Strategist & Local Business Growth Lead',
    bio: 'Specialist in hyper-local Google Business optimization, Instagram growth for cafes, clinics, fitness centers, and Meta ads targeting Palghar, Boisar, and Virar customers.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    location: 'Boisar (Near Tarapur MIDC Gate 1)',
    areaName: 'Boisar',
    distanceFromBoisarKm: 3.0,
    isTeam: false,
    hourlyRateInr: 750,
    startingProjectRateInr: 12000,
    rating: 4.85,
    reviewCount: 19,
    availability: 'Part-time Available',
    experienceYears: 3,
    category: 'Digital Marketing & SEO',
    skills: ['Local SEO', 'Meta Ads', 'Instagram Growth', 'Google My Business', 'Content Strategy'],
    languages: ['Hindi', 'Marathi', 'English', 'Gujarati'],
    verifiedLocal: true,
    completedProjectsCount: 29,
    contactPreference: 'Phone & WhatsApp',
    portfolio: [
      {
        id: 'port-5',
        title: 'Royal Dine Restaurant Weekend Footfall Campaign',
        description: 'Targeted Instagram Reel and Meta Ads campaign that boosted weekend dinner footfall by 38% in Boisar.',
        imageUrl: categoryLocalBusiness,
        category: 'Local Marketing',
        completionYear: '2025',
        clientType: 'Hospitality',
        skillsUsed: ['Meta Ads', 'Reels Production', 'Canva', 'Local SEO']
      }
    ],
    services: [
      {
        id: 'srv-5',
        title: 'Google Maps & Local Search Dominance Package',
        description: 'Complete optimization of Google Business Profile, local directory listings, and review generation strategy.',
        startingPriceInr: 9000,
        deliveryTimeDays: 5
      },
      {
        id: 'srv-6',
        title: 'Monthly Instagram & Meta Ads Management',
        description: '12 high-quality localized posts, 4 reels, and hyper-local target ads setup.',
        startingPriceInr: 15000,
        deliveryTimeDays: 30
      }
    ],
    reviews: [
      {
        id: 'rev-4',
        clientName: 'Pradeep Shah',
        clientCompany: 'FitLife Gym Boisar',
        clientLocation: 'Boisar',
        rating: 5,
        date: '2026-02-28',
        comment: 'Pooja took our Google rating from 3.8 to 4.7 and we got 45 new annual memberships in January alone.',
        projectTitle: 'Local Gym Growth'
      }
    ]
  },
  {
    id: 'fl-4',
    name: 'Omkar Jadhav',
    headline: 'Commercial Video Producer & Drone Cinematographer',
    bio: 'Professional videographer equipped with 4K cameras, DJI drones, and studio lighting. Creates industrial plant tours, restaurant promo videos, and product showcase reels in the Palghar region.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    location: 'Tarapur MIDC, Boisar',
    areaName: 'Tarapur MIDC',
    distanceFromBoisarKm: 4.5,
    isTeam: false,
    hourlyRateInr: 1200,
    startingProjectRateInr: 20000,
    rating: 4.9,
    reviewCount: 16,
    availability: 'Available Immediately',
    experienceYears: 4,
    category: 'Video & Media Production',
    skills: ['Video Editing', 'Drone Videography', 'Premiere Pro', 'Commercial Shoot', 'Color Grading'],
    languages: ['Marathi', 'Hindi', 'English'],
    verifiedLocal: true,
    completedProjectsCount: 22,
    contactPreference: 'Phone & WhatsApp',
    portfolio: [
      {
        id: 'port-6',
        title: 'Tarapur Chemical Industries 4K Corporate Film',
        description: 'Comprehensive aerial drone footage and indoor safety adherence video for international buyer showcase.',
        imageUrl: heroMarketplace,
        category: 'Corporate Film',
        completionYear: '2025',
        clientType: 'Chemical Exporter',
        skillsUsed: ['DJI Drone', '4K Cinema', 'Premiere Pro', 'DaVinci Resolve']
      }
    ],
    services: [
      {
        id: 'srv-7',
        title: 'Half-Day Local Business Video Shoot + 2 Social Reels',
        description: 'On-site filming with professional lighting, mic, and 48-hour delivery of edited vertical reels.',
        startingPriceInr: 16000,
        deliveryTimeDays: 3
      }
    ],
    reviews: [
      {
        id: 'rev-5',
        clientName: 'Manish Chintaman',
        clientCompany: 'Apex Polymers Tarapur',
        clientLocation: 'Tarapur MIDC',
        rating: 5,
        date: '2026-01-11',
        comment: 'High grade drone work inside the factory without disrupting production lines. The final video was praised by our European clients.',
        projectTitle: 'Plant Overview Video'
      }
    ]
  },
  {
    id: 'fl-5',
    name: 'Vikas & Team (MechCAD Solutions)',
    headline: 'Industrial CAD, 3D Product Modeling & Tool Design Team',
    bio: 'Team of two senior mechanical engineers with strong background in Tarapur chemical and fabrication equipment design. SolidWorks, AutoCAD 2D/3D, and tooling drawings.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
    location: 'Tarapur Industrial Area',
    areaName: 'Tarapur MIDC',
    distanceFromBoisarKm: 5.0,
    isTeam: true,
    teamSize: 2,
    teamMembers: ['Vikas Raut (Senior CAD)', 'Ganesh Patil (Tooling Specialist)'],
    hourlyRateInr: 1100,
    startingProjectRateInr: 22000,
    rating: 4.88,
    reviewCount: 14,
    availability: 'Available Immediately',
    experienceYears: 6,
    category: 'Industrial & CAD Engineering',
    skills: ['SolidWorks', 'AutoCAD', '3D Modeling', 'Sheet Metal Design', 'Mechanical Drafting'],
    languages: ['Marathi', 'English', 'Hindi'],
    verifiedLocal: true,
    completedProjectsCount: 31,
    contactPreference: 'In-person Meeting First',
    portfolio: [
      {
        id: 'port-7',
        title: 'Custom Reaction Vessel 3D Assembly & Fabrication Sheets',
        description: 'Complete ASME standard vessel modeling, nozzle orientation, and bill of materials generation.',
        imageUrl: categoryTechDesign,
        category: 'Mechanical Engineering',
        completionYear: '2025',
        clientType: 'Process Equipment Fabricator',
        skillsUsed: ['SolidWorks', 'AutoCAD', 'BOM Generation']
      }
    ],
    services: [
      {
        id: 'srv-8',
        title: 'Production-Ready 2D CAD Drawings & Fabrication Plans',
        description: 'Precise dimensional schematics with tolerance charts ready for machine shop floor.',
        startingPriceInr: 18000,
        deliveryTimeDays: 5
      }
    ],
    reviews: [
      {
        id: 'rev-6',
        clientName: 'Dinesh Solanki',
        clientCompany: 'Solanki Engineering Works',
        clientLocation: 'Boisar',
        rating: 5,
        date: '2026-02-05',
        comment: 'Flawless drafting and they even visited our workshop to check the physical prototype fitment.',
        projectTitle: 'Hydraulic Press Jig Drafting'
      }
    ]
  },
  {
    id: 'fl-6',
    name: 'Sayali Mhatre',
    headline: 'Bilingual Copywriter & Technical Content Specialist',
    bio: 'Crafts persuasive product catalogs, government tender documentation, and website copy in both Marathi and English. Specializes in local business storytelling and export profiles.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    location: 'Dahanu Road (Near Beach)',
    areaName: 'Dahanu',
    distanceFromBoisarKm: 22.0,
    isTeam: false,
    hourlyRateInr: 600,
    startingProjectRateInr: 8000,
    rating: 4.92,
    reviewCount: 18,
    availability: 'Available Immediately',
    experienceYears: 3,
    category: 'Content & Copywriting',
    skills: ['Copywriting', 'Marathi Translation', 'Technical Writing', 'SEO Content', 'Product Descriptions'],
    languages: ['Marathi', 'English', 'Hindi'],
    verifiedLocal: true,
    completedProjectsCount: 27,
    contactPreference: 'Email & SkillNest Direct',
    portfolio: [
      {
        id: 'port-8',
        title: 'Dahanu Agro Tourism Portal Content & Multilingual Guide',
        description: 'Wrote authentic experiential copy in English & Marathi that increased regional weekend bookings.',
        imageUrl: categoryLocalBusiness,
        category: 'Travel & Local Culture',
        completionYear: '2025',
        clientType: 'Tourism Board & Homestays',
        skillsUsed: ['SEO Copywriting', 'Marathi Translation', 'Storytelling']
      }
    ],
    services: [
      {
        id: 'srv-9',
        title: 'Website Copywriting Package (5 Core Pages)',
        description: 'Clear, compelling value proposition and service descriptions optimized for search.',
        startingPriceInr: 10000,
        deliveryTimeDays: 4
      }
    ],
    reviews: [
      {
        id: 'rev-7',
        clientName: 'Nitin Tare',
        clientCompany: 'Konkan Fruit Orchards',
        clientLocation: 'Dahanu',
        rating: 5,
        date: '2026-03-04',
        comment: 'Her Marathi writing captured the soul of our orchard produce while keeping the English brochure crisp for city buyers.',
        projectTitle: 'Bilingual Brochure Copy'
      }
    ]
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'Modern Responsive Website & QR Menu for Cafe Palms Boisar',
    category: 'Web & App Development',
    description: 'We are revamping Cafe Palms in Boisar and need a clean, mobile-first website where patrons can view our daily specials, scan QR codes on tables to see the photo menu, and get location directions. Prefer someone nearby in Boisar or Palghar so we can meet at the cafe to discuss the menu layout.',
    requiredSkills: ['React', 'Next.js', 'Tailwind CSS', 'Mobile Apps', 'Local SEO'],
    clientLocation: 'Boisar, Palghar Dist.',
    preferredArea: 'Boisar',
    budgetMinInr: 20000,
    budgetMaxInr: 32000,
    isBudgetNegotiable: true,
    timeline: '2-3 weeks',
    preferredWorkerType: 'Any',
    clientId: 'user-client-1',
    clientName: 'Aniket Patil',
    clientOrganization: 'Cafe Palms & Bistro',
    postedDate: '2026-03-08',
    status: 'Open',
    proposalsCount: 3,
    contactPreference: 'In-person Meeting at Cafe'
  },
  {
    id: 'proj-2',
    title: 'MIDC Factory Material Dispatch & Gate Pass Web System',
    category: 'Web & App Development',
    description: 'Looking for a developer or team near Tarapur MIDC to build an internal web app for creating lorry gate passes, recording steel bar heat numbers, and printing dispatch slips. Must replace our manual logbook and be accessible via office desktop and warehouse tablet.',
    requiredSkills: ['React', 'TypeScript', 'PostgreSQL', 'Node.js'],
    clientLocation: 'Tarapur MIDC, Boisar',
    preferredArea: 'Tarapur MIDC',
    budgetMinInr: 35000,
    budgetMaxInr: 60000,
    isBudgetNegotiable: true,
    timeline: '3-4 weeks',
    preferredWorkerType: 'Agency / Freelance Team',
    clientId: 'client-midc-2',
    clientName: 'Rajendra Joshi',
    clientOrganization: 'Joshi Precision Forgings Pvt Ltd',
    postedDate: '2026-03-05',
    status: 'Open',
    proposalsCount: 2,
    contactPreference: 'Phone & WhatsApp'
  },
  {
    id: 'proj-3',
    title: 'Brand Packaging & Logo Design for Dahanu Chikoo Agro Products',
    category: 'UI/UX & Graphic Design',
    description: 'We are launching packaged chikoo chips and dried fruit snack pouches from our Dahanu orchards. Need an attractive, modern eco-friendly packaging pouch design, nutritional label template, and refreshed brand mark. Designer must be comfortable coordinating with local printing presses.',
    requiredSkills: ['Packaging Design', 'Brand Identity', 'Illustrator', 'Figma'],
    clientLocation: 'Dahanu, Maharashtra',
    preferredArea: 'Dahanu',
    budgetMinInr: 18000,
    budgetMaxInr: 28000,
    isBudgetNegotiable: true,
    timeline: '2 weeks',
    preferredWorkerType: 'Any',
    clientId: 'client-agro-3',
    clientName: 'Pravin Vartak',
    clientOrganization: 'Vartak Agro Farms Dahanu',
    postedDate: '2026-03-07',
    status: 'Open',
    proposalsCount: 4,
    contactPreference: 'In-person Meeting First'
  },
  {
    id: 'proj-4',
    title: 'Local Google Maps SEO & Instagram Ads for Multi-Speciality Dental Clinic',
    category: 'Digital Marketing & SEO',
    description: 'Our dental clinic in Palghar East needs targeted local patient footfall. We want to rank #1 on Google for "dentist in Palghar", generate positive patient reviews ethically, and run Instagram video ads for aligners and teeth whitening.',
    requiredSkills: ['Google My Business', 'Local SEO', 'Meta Ads', 'Instagram Growth'],
    clientLocation: 'Palghar East',
    preferredArea: 'Palghar',
    budgetMinInr: 12000,
    budgetMaxInr: 20000,
    isBudgetNegotiable: true,
    timeline: 'Ongoing (1-3 months)',
    preferredWorkerType: 'Individual Freelancer',
    clientId: 'client-clinic-4',
    clientName: 'Dr. Sneha Sawant',
    clientOrganization: 'Palghar Smile Care',
    postedDate: '2026-03-09',
    status: 'Open',
    proposalsCount: 1,
    contactPreference: 'Phone & WhatsApp'
  },
  {
    id: 'proj-5',
    title: 'Industrial 4K Drone Video & Plant Walkthrough Shoot',
    category: 'Video & Media Production',
    description: 'Need a professional videographer with drone permissions for a 1-day shoot inside our 45,000 sq ft chemical manufacturing plant in Tarapur MIDC. Output needed: 2-minute 4K corporate film and 3 short vertical reels for LinkedIn & trade expos.',
    requiredSkills: ['Drone Videography', 'Video Editing', 'Premiere Pro', 'Commercial Shoot'],
    clientLocation: 'Tarapur MIDC',
    preferredArea: 'Tarapur MIDC',
    budgetMinInr: 22000,
    budgetMaxInr: 35000,
    isBudgetNegotiable: false,
    timeline: '1-2 weeks',
    preferredWorkerType: 'Any',
    clientId: 'client-ind-5',
    clientName: 'Hemant Karkera',
    clientOrganization: 'Aura Speciality Chemicals',
    postedDate: '2026-03-10',
    status: 'Open',
    proposalsCount: 2,
    contactPreference: 'Phone & WhatsApp'
  }
];

export const SERVICE_CATEGORIES = [
  {
    id: 'cat-web',
    name: 'Web & App Development',
    description: 'Local business websites, custom shop portals, billing systems, and cross-platform apps.',
    freelancerCount: 14,
    popularSkills: ['React', 'Next.js', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Mobile Apps']
  },
  {
    id: 'cat-design',
    name: 'UI/UX & Graphic Design',
    description: 'Brand identity, logos, packaging, shop signboards, and modern digital interfaces.',
    freelancerCount: 18,
    popularSkills: ['Figma', 'Brand Identity', 'Packaging Design', 'Illustrator', 'UI/UX']
  },
  {
    id: 'cat-mktg',
    name: 'Digital Marketing & SEO',
    description: 'Google Maps rankings, hyper-local Instagram reels, and targeted Meta ads in Maharashtra.',
    freelancerCount: 12,
    popularSkills: ['Local SEO', 'Google My Business', 'Meta Ads', 'Instagram Growth', 'Content Strategy']
  },
  {
    id: 'cat-video',
    name: 'Video & Media Production',
    description: 'Drone factory tours, restaurant social reels, product photography, and corporate films.',
    freelancerCount: 9,
    popularSkills: ['Drone Videography', 'Video Editing', 'Commercial Shoot', 'Premiere Pro']
  },
  {
    id: 'cat-cad',
    name: 'Industrial & CAD Engineering',
    description: 'SolidWorks 3D models, sheet metal tool drafting, and manufacturing drawings for Tarapur MIDC.',
    freelancerCount: 7,
    popularSkills: ['SolidWorks', 'AutoCAD', '3D Modeling', 'Sheet Metal Design', 'Mechanical Drafting']
  },
  {
    id: 'cat-content',
    name: 'Content & Copywriting',
    description: 'Bilingual Marathi-English website copy, marketing brochures, and tender documentation.',
    freelancerCount: 8,
    popularSkills: ['Copywriting', 'Marathi Translation', 'Technical Writing', 'SEO Content']
  }
];

export const REGIONS_SERVED = [
  { name: 'Boisar', label: 'Boisar Central & Railway', description: 'Tech hub & commercial market' },
  { name: 'Tarapur MIDC', label: 'Tarapur Industrial Zone', description: 'Major manufacturing & chemical belt' },
  { name: 'Palghar', label: 'Palghar City & Station', description: 'District headquarters & creative hub' },
  { name: 'Dahanu', label: 'Dahanu & Gholvad', description: 'Agro-processing & tourism belt' },
  { name: 'Virar', label: 'Virar & Northern Suburbs', description: 'Metropolitan fringe' },
  { name: 'Remote', label: 'Remote / Virtual First', description: 'Anywhere with digital delivery' }
];
