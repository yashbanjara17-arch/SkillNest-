import { prisma } from '../../config/database';
import { createError } from '../../middleware/errorHandler';
import type { ProjectQuery, CreateProjectInput, UpdateProjectInput } from './projects.schema';
import { Prisma } from '@prisma/client';

const projectInclude = {
  clientProfile: {
    include: { user: { select: { id: true, name: true, avatarUrl: true } } },
  },
  skills: { include: { skill: true } },
  _count: { select: { proposals: true } },
} satisfies Prisma.ProjectInclude;

function formatProject(p: Record<string, unknown> & {
  skills?: Array<{ skill: { name: string } }>;
  _count?: { proposals: number };
}) {
  const { skills, _count, ...rest } = p;
  return {
    ...rest,
    requiredSkills: skills?.map((s) => s.skill.name) ?? [],
    proposalsCount: _count?.proposals ?? 0,
  };
}

export async function listProjects(query: ProjectQuery) {
  const { page, limit, search, category, status, area, minBudget, maxBudget, workerType, skills } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.ProjectWhereInput = {
    status: status
      ? (status as Prisma.EnumProjectStatusFilter)
      : { not: 'Flagged' as const }, // Hide flagged from public
  };

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (category) where.category = { contains: category, mode: 'insensitive' };
  if (area) where.preferredArea = { contains: area, mode: 'insensitive' };
  if (minBudget !== undefined) where.budgetMaxInr = { gte: minBudget };
  if (maxBudget !== undefined) where.budgetMinInr = { lte: maxBudget };
  if (workerType) where.preferredWorkerType = workerType as Prisma.EnumPreferredWorkerTypeFilter;

  if (skills) {
    const skillList = skills.split(',').map((s) => s.trim()).filter(Boolean);
    if (skillList.length > 0) {
      where.skills = { some: { skill: { name: { in: skillList, mode: 'insensitive' } } } };
    }
  }

  const [total, items] = await Promise.all([
    prisma.project.count({ where }),
    prisma.project.findMany({
      where,
      include: projectInclude,
      orderBy: { postedDate: 'desc' },
      skip,
      take: limit,
    }),
  ]);

  return {
    items: items.map(formatProject),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getProjectById(id: string) {
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      ...projectInclude,
      proposals: {
        include: {
          freelancer: {
            include: { user: { select: { name: true, avatarUrl: true } } },
          },
        },
        orderBy: { submittedAt: 'desc' },
      },
    },
  });

  if (!project) throw createError('Project not found', 404);
  return formatProject(project as Record<string, unknown> & {
    skills?: Array<{ skill: { name: string } }>;
    _count?: { proposals: number };
  });
}

export async function createProject(userId: string, input: CreateProjectInput) {
  const clientProfile = await prisma.clientProfile.findUnique({ where: { userId } });
  if (!clientProfile) throw createError('Client profile not found', 404);

  const { requiredSkills, ...projectData } = input;

  const project = await prisma.$transaction(async (tx) => {
    const created = await tx.project.create({
      data: {
        ...projectData,
        clientProfileId: clientProfile.id,
      },
      include: projectInclude,
    });

    if (requiredSkills && requiredSkills.length > 0) {
      for (const name of requiredSkills) {
        const skill = await tx.skill.upsert({
          where: { name },
          create: { name },
          update: {},
        });
        await tx.projectSkill.upsert({
          where: { projectId_skillId: { projectId: created.id, skillId: skill.id } },
          create: { projectId: created.id, skillId: skill.id },
          update: {},
        });
      }

      return tx.project.findUnique({ where: { id: created.id }, include: projectInclude });
    }

    return created;
  });

  return formatProject(project as Record<string, unknown> & {
    skills?: Array<{ skill: { name: string } }>;
    _count?: { proposals: number };
  });
}

export async function updateProject(userId: string, projectId: string, input: UpdateProjectInput) {
  const clientProfile = await prisma.clientProfile.findUnique({ where: { userId } });
  if (!clientProfile) throw createError('Client profile not found', 404);

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) throw createError('Project not found', 404);
  if (project.clientProfileId !== clientProfile.id) throw createError('You do not own this project', 403);

  const { requiredSkills, ...updateData } = input;

  const updated = await prisma.$transaction(async (tx) => {
    if (requiredSkills !== undefined) {
      await tx.projectSkill.deleteMany({ where: { projectId } });
      for (const name of requiredSkills) {
        const skill = await tx.skill.upsert({
          where: { name },
          create: { name },
          update: {},
        });
        await tx.projectSkill.upsert({
          where: { projectId_skillId: { projectId, skillId: skill.id } },
          create: { projectId, skillId: skill.id },
          update: {},
        });
      }
    }

    return tx.project.update({
      where: { id: projectId },
      data: updateData,
      include: projectInclude,
    });
  });

  return formatProject(updated as Record<string, unknown> & {
    skills?: Array<{ skill: { name: string } }>;
    _count?: { proposals: number };
  });
}

export async function deleteProject(userId: string, projectId: string) {
  const clientProfile = await prisma.clientProfile.findUnique({ where: { userId } });
  if (!clientProfile) throw createError('Client profile not found', 404);

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) throw createError('Project not found', 404);
  if (project.clientProfileId !== clientProfile.id) throw createError('You do not own this project', 403);

  await prisma.project.delete({ where: { id: projectId } });
}

export async function getClientProjects(userId: string) {
  const clientProfile = await prisma.clientProfile.findUnique({ where: { userId } });
  if (!clientProfile) return [];

  const projects = await prisma.project.findMany({
    where: { clientProfileId: clientProfile.id },
    include: projectInclude,
    orderBy: { postedDate: 'desc' },
  });

  return projects.map(formatProject);
}
