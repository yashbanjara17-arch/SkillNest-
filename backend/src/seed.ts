/**
 * Development seed script.
 * Run with: npm run db:seed
 * Seeds Boisar/Palghar region sample data. NEVER run in production.
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Seed must never run in production');
  }

  console.log('🌱 Seeding development data...');

  // ── Admin User (provisioned via seed only, never via public registration) ─
  const adminHash = await argon2.hash('Admin@SkillNest2026!', { type: argon2.argon2id });
  const admin = await prisma.user.upsert({
    where: { email: 'admin@skillnest.local' },
    update: {},
    create: {
      name: 'Saurabh Mehta',
      email: 'admin@skillnest.local',
      passwordHash: adminHash,
      role: 'admin',
      location: 'Boisar HQ, Maharashtra',
      phone: '+91 99000 11222',
      bio: 'Regional community lead and platform administrator overseeing Boisar and Palghar operations.',
      status: 'Active',
    },
  });
  console.log('✅ Admin user:', admin.email);

  // ── Client User ────────────────────────────────────────────────────────────
  const clientHash = await argon2.hash('Client@123', { type: argon2.argon2id });
  const clientUser = await prisma.user.upsert({
    where: { email: 'aniket@cafepalms.in' },
    update: {},
    create: {
      name: 'Aniket Patil',
      email: 'aniket@cafepalms.in',
      passwordHash: clientHash,
      role: 'client',
      location: 'Boisar, Palghar Dist.',
      phone: '+91 98234 11223',
      bio: 'Founder of Cafe Palms, looking for local digital partners to upgrade our online presence.',
      status: 'Active',
    },
  });

  await prisma.clientProfile.upsert({
    where: { userId: clientUser.id },
    update: {},
    create: {
      userId: clientUser.id,
      organization: 'Cafe Palms & Bistro Boisar',
      businessType: 'Food & Beverage',
      businessAddress: 'Station Road, Boisar, Palghar, Maharashtra 401501',
    },
  });
  console.log('✅ Client user:', clientUser.email);

  // ── Freelancer User 1 ──────────────────────────────────────────────────────
  const flHash1 = await argon2.hash('Freelancer@123', { type: argon2.argon2id });
  const flUser1 = await prisma.user.upsert({
    where: { email: 'rahul.dev@skillnest.local' },
    update: {},
    create: {
      name: 'Rahul Sharma',
      email: 'rahul.dev@skillnest.local',
      passwordHash: flHash1,
      role: 'freelancer',
      location: 'Boisar (Near Railway Station)',
      phone: '+91 98765 43210',
      bio: 'Full-stack web and mobile developer with 5+ years building software for local MSMEs in Maharashtra.',
      status: 'Active',
    },
  });

  // Upsert skills
  const skillNames = ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Mobile Apps'];
  const skills = await Promise.all(
    skillNames.map((name) => prisma.skill.upsert({ where: { name }, update: {}, create: { name } }))
  );

  const fl1Profile = await prisma.freelancerProfile.upsert({
    where: { userId: flUser1.id },
    update: {},
    create: {
      userId: flUser1.id,
      headline: 'Senior Full-Stack Web & Mobile App Developer',
      bio: 'Over 5 years of software engineering experience. Specializes in React web apps, mobile ordering systems, and inventory tools for shops and factories in the Boisar-Tarapur corridor.',
      location: 'Boisar, Palghar Dist.',
      areaName: 'Boisar',
      distanceFromBoisarKm: 1.5,
      isTeam: false,
      hourlyRateInr: 950,
      startingProjectRateInr: 18000,
      rating: 4.9,
      reviewCount: 24,
      availability: 'AvailableImmediately',
      experienceYears: 5,
      category: 'WebAndAppDevelopment',
      languages: ['Marathi', 'Hindi', 'English'],
      verifiedLocal: true,
      completedProjectsCount: 38,
      contactPreference: 'PhoneAndWhatsApp',
    },
  });

  // Attach skills
  for (const skill of skills) {
    await prisma.freelancerSkill.upsert({
      where: { freelancerId_skillId: { freelancerId: fl1Profile.id, skillId: skill.id } },
      update: {},
      create: { freelancerId: fl1Profile.id, skillId: skill.id },
    });
  }

  // Portfolio item
  await prisma.portfolioItem.upsert({
    where: { id: 'seed-port-1' },
    update: {},
    create: {
      id: 'seed-port-1',
      freelancerId: fl1Profile.id,
      title: 'Tarapur Steel Forge Inventory Dashboard',
      description: 'Real-time raw material and dispatch tracker for an MIDC manufacturer with barcode scanning.',
      category: 'Web Application',
      completionYear: '2025',
      clientType: 'Manufacturing MSME',
      skillsUsed: ['React', 'TypeScript', 'PostgreSQL', 'Tailwind CSS'],
    },
  });

  // Service
  await prisma.freelancerService.upsert({
    where: { id: 'seed-svc-1' },
    update: {},
    create: {
      id: 'seed-svc-1',
      freelancerId: fl1Profile.id,
      title: 'Local Business Website (React + SEO)',
      description: 'A fast, mobile-first business website with Google Maps integration, WhatsApp contact, and basic SEO.',
      startingPriceInr: 18000,
      deliveryTimeDays: 14,
    },
  });

  console.log('✅ Freelancer user:', flUser1.email);

  // ── Freelancer User 2 (Team) ───────────────────────────────────────────────
  const flHash2 = await argon2.hash('Freelancer@123', { type: argon2.argon2id });
  const flUser2 = await prisma.user.upsert({
    where: { email: 'contact@pixelcraftstudio.in' },
    update: {},
    create: {
      name: 'PixelCraft Studio',
      email: 'contact@pixelcraftstudio.in',
      passwordHash: flHash2,
      role: 'freelancer',
      location: 'Palghar West',
      phone: '+91 91234 56789',
      bio: 'A 3-member boutique design and frontend development team specializing in branding and local store ecommerce.',
      status: 'Active',
    },
  });

  const designSkills = ['Figma', 'React', 'Branding', 'UI/UX Design', 'Shopify'];
  const dSkills = await Promise.all(
    designSkills.map((name) => prisma.skill.upsert({ where: { name }, update: {}, create: { name } }))
  );

  const fl2Profile = await prisma.freelancerProfile.upsert({
    where: { userId: flUser2.id },
    update: {},
    create: {
      userId: flUser2.id,
      headline: 'Boutique Creative & Frontend Collective (3 Members)',
      bio: 'Award-winning boutique team delivering premium UI/UX, branding, and ecommerce storefronts for local and regional businesses.',
      location: 'Palghar West',
      areaName: 'Palghar',
      distanceFromBoisarKm: 12,
      isTeam: true,
      teamSize: 3,
      teamMemberNames: ['Priya Desai (Design Lead)', 'Karan Joshi (Frontend)', 'Meena Rao (Content)'],
      hourlyRateInr: 1200,
      startingProjectRateInr: 25000,
      rating: 4.7,
      reviewCount: 18,
      availability: 'AvailableImmediately',
      experienceYears: 4,
      category: 'UIUXAndGraphicDesign',
      languages: ['Marathi', 'Hindi', 'English'],
      verifiedLocal: true,
      completedProjectsCount: 27,
      contactPreference: 'EmailAndSkillNestDirect',
    },
  });

  for (const skill of dSkills) {
    await prisma.freelancerSkill.upsert({
      where: { freelancerId_skillId: { freelancerId: fl2Profile.id, skillId: skill.id } },
      update: {},
      create: { freelancerId: fl2Profile.id, skillId: skill.id },
    });
  }

  console.log('✅ Freelancer team:', flUser2.email);

  // ── Sample Project ─────────────────────────────────────────────────────────
  const cpProfile = await prisma.clientProfile.findUnique({ where: { userId: clientUser.id } });
  if (cpProfile) {
    const webSkill = skills.find((s) => s.name === 'React')!;
    const tsSkill = skills.find((s) => s.name === 'TypeScript')!;

    const project = await prisma.project.upsert({
      where: { id: 'seed-proj-1' },
      update: {},
      create: {
        id: 'seed-proj-1',
        clientProfileId: cpProfile.id,
        title: 'QR Code Digital Menu & Ordering System for Cafe Tables',
        category: 'Web & App Development',
        description: 'We need a mobile-friendly digital menu that guests can scan at each table via QR code. The menu should support categories, daily specials, photos, and WhatsApp order notifications. Staff should be able to update it without technical knowledge.',
        clientLocation: 'Boisar, Palghar',
        preferredArea: 'Boisar',
        budgetMinInr: 20000,
        budgetMaxInr: 35000,
        isBudgetNegotiable: true,
        timeline: '3-4 weeks',
        preferredWorkerType: 'Any',
        status: 'Open',
        contactPreference: 'WhatsApp preferred',
      },
    });

    await prisma.projectSkill.upsert({
      where: { projectId_skillId: { projectId: project.id, skillId: webSkill.id } },
      update: {},
      create: { projectId: project.id, skillId: webSkill.id },
    });
    await prisma.projectSkill.upsert({
      where: { projectId_skillId: { projectId: project.id, skillId: tsSkill.id } },
      update: {},
      create: { projectId: project.id, skillId: tsSkill.id },
    });

    console.log('✅ Sample project created');
  }

  // ── Platform Settings ──────────────────────────────────────────────────────
  const defaultSettings = [
    { key: 'platform_commission_rate', value: '0', description: 'Platform commission rate (%)' },
    { key: 'max_discovery_radius_km', value: '50', description: 'Maximum freelancer discovery radius (km)' },
    { key: 'hub_boisar_lat', value: '19.8000', description: 'Boisar hub latitude' },
    { key: 'hub_boisar_lng', value: '72.7667', description: 'Boisar hub longitude' },
    { key: 'featured_badge_enabled', value: 'true', description: 'Enable featured badge for freelancers' },
  ];

  for (const s of defaultSettings) {
    await prisma.platformSetting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }
  console.log('✅ Platform settings seeded');

  console.log('\n🎉 Seed complete!');
  console.log('\nDev credentials (NEVER use in production):');
  console.log('  Admin:      admin@skillnest.local  / Admin@SkillNest2026!');
  console.log('  Client:     aniket@cafepalms.in    / Client@123');
  console.log('  Freelancer: rahul.dev@skillnest.local / Freelancer@123');
  console.log('  Freelancer: contact@pixelcraftstudio.in / Freelancer@123');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
