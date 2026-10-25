import { prisma } from '../../config/database';
import { createError } from '../../middleware/errorHandler';
import type { FreelancerQuery, UpdateFreelancerInput, PortfolioItemInput, ServiceInput } from './freelancers.schema';
import { Prisma } from '@prisma/client';

const freelancerInclude = {
  user: { select: { id: true, name: true, email: true, avatarUrl: true, location: true, phone: true } },
  skills: { include: { skill: true } },
  portfolio: true,
  services: true,
  reviews: { where: { moderationStatus: 'Published' as const } },
} satisfies Prisma.FreelancerProfileInclude;

export async function listFreelancers(query: FreelancerQuery) {
  const { page, limit, search, category, area, availability, isTeam, minRate, maxRate, skills, verifiedOnly } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.FreelancerProfileWhereInput = {};

  if (search) {
    where.OR = [
      { user: { name: { contains: search, mode: 'insensitive' } } },
      { headline: { contains: search, mode: 'insensitive' } },
      { bio: { contains: search, mode: 'insensitive' } },
      { skills: { some: { skill: { name: { contains: search, mode: 'insensitive' } } } } },
    ];
  }

  if (category) where.category = category as Prisma.EnumFreelancerCategoryNullableFilter;
  if (area) where.areaName = { contains: area, mode: 'insensitive' };
  if (availability) where.availability = availability as Prisma.EnumFreelancerAvailabilityFilter;
  if (isTeam !== undefined) where.isTeam = isTeam === 'true';
  if (minRate !== undefined) where.hourlyRateInr = { gte: minRate };
  if (maxRate !== undefined) {
    where.hourlyRateInr = { ...(where.hourlyRateInr as object || {}), lte: maxRate };
  }
  if (verifiedOnly === 'true') where.verifiedLocal = true;

  if (skills) {
    const skillList = skills.split(',').map((s) => s.trim()).filter(Boolean);
    if (skillList.length > 0) {
      where.skills = { some: { skill: { name: { in: skillList, mode: 'insensitive' } } } };
    }
  }

  const [total, items] = await Promise.all([
    prisma.freelancerProfile.count({ where }),
    prisma.freelancerProfile.findMany({
      where,
      include: freelancerInclude,
      orderBy: [{ verifiedLocal: 'desc' }, { rating: 'desc' }],
      skip,
      take: limit,
    }),
  ]);

  return {
    items: items.map(formatFreelancer),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getFreelancerById(id: string) {
  const freelancer = await prisma.freelancerProfile.findUnique({
    where: { id },
    include: freelancerInclude,
  });

  if (!freelancer) throw createError('Freelancer not found', 404);
  return formatFreelancer(freelancer);
}

export async function getFreelancerByUserId(userId: string) {
  const freelancer = await prisma.freelancerProfile.findUnique({
    where: { userId },
    include: freelancerInclude,
  });
  return freelancer ? formatFreelancer(freelancer) : null;
}

export async function updateFreelancerProfile(userId: string, input: UpdateFreelancerInput) {
  const profile = await prisma.freelancerProfile.findUnique({ where: { userId } });
  if (!profile) throw createError('Freelancer profile not found', 404);

  const { skills: skillNames, ...profileData } = input;

  const updated = await prisma.$transaction(async (tx) => {
    // Update skills if provided
    if (skillNames !== undefined) {
      // Remove all existing skills
      await tx.freelancerSkill.deleteMany({ where: { freelancerId: profile.id } });

      // Upsert and reconnect skills
      for (const name of skillNames) {
        const skill = await tx.skill.upsert({
          where: { name },
          create: { name },
          update: {},
        });
        await tx.freelancerSkill.upsert({
          where: { freelancerId_skillId: { freelancerId: profile.id, skillId: skill.id } },
          create: { freelancerId: profile.id, skillId: skill.id },
          update: {},
        });
      }
    }

    return tx.freelancerProfile.update({
      where: { userId },
      data: profileData,
      include: freelancerInclude,
    });
  });

  return formatFreelancer(updated);
}

// Portfolio
export async function addPortfolioItem(userId: string, input: PortfolioItemInput) {
  const profile = await prisma.freelancerProfile.findUnique({ where: { userId } });
  if (!profile) throw createError('Freelancer profile not found', 404);

  return prisma.portfolioItem.create({
    data: { ...input, freelancerId: profile.id },
  });
}

export async function deletePortfolioItem(userId: string, itemId: string) {
  const profile = await prisma.freelancerProfile.findUnique({ where: { userId } });
  if (!profile) throw createError('Freelancer profile not found', 404);

  const item = await prisma.portfolioItem.findUnique({ where: { id: itemId } });
  if (!item || item.freelancerId !== profile.id) {
    throw createError('Portfolio item not found', 404);
  }

  await prisma.portfolioItem.delete({ where: { id: itemId } });
}

// Services
export async function addService(userId: string, input: ServiceInput) {
  const profile = await prisma.freelancerProfile.findUnique({ where: { userId } });
  if (!profile) throw createError('Freelancer profile not found', 404);

  return prisma.freelancerService.create({
    data: { ...input, freelancerId: profile.id },
  });
}

export async function deleteService(userId: string, serviceId: string) {
  const profile = await prisma.freelancerProfile.findUnique({ where: { userId } });
  if (!profile) throw createError('Freelancer profile not found', 404);

  const service = await prisma.freelancerService.findUnique({ where: { id: serviceId } });
  if (!service || service.freelancerId !== profile.id) {
    throw createError('Service not found', 404);
  }

  await prisma.freelancerService.delete({ where: { id: serviceId } });
}

// Format helper
function formatFreelancer(fl: Record<string, unknown> & { skills?: Array<{ skill: { name: string } }> }) {
  const { skills, ...rest } = fl;
  return {
    ...rest,
    skills: skills?.map((s) => s.skill.name) ?? [],
  };
}
