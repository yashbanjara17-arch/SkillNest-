import { prisma } from '../../config/database';
import { createError } from '../../middleware/errorHandler';

export async function getSavedFreelancers(userId: string) {
  return prisma.savedFreelancer.findMany({
    where: { userId },
    include: {
      freelancer: {
        include: {
          user: { select: { name: true, avatarUrl: true, location: true } },
          skills: { include: { skill: true } },
        },
      },
    },
    orderBy: { savedAt: 'desc' },
  });
}

export async function toggleSaveFreelancer(userId: string, freelancerId: string) {
  const profile = await prisma.freelancerProfile.findUnique({ where: { id: freelancerId } });
  if (!profile) throw createError('Freelancer not found', 404);

  const existing = await prisma.savedFreelancer.findUnique({
    where: { userId_freelancerId: { userId, freelancerId } },
  });

  if (existing) {
    await prisma.savedFreelancer.delete({
      where: { userId_freelancerId: { userId, freelancerId } },
    });
    return { saved: false };
  } else {
    await prisma.savedFreelancer.create({ data: { userId, freelancerId } });
    return { saved: true };
  }
}

export async function getSavedProjects(userId: string) {
  return prisma.savedProject.findMany({
    where: { userId },
    include: {
      project: {
        include: {
          skills: { include: { skill: true } },
          clientProfile: { include: { user: { select: { name: true } } } },
          _count: { select: { proposals: true } },
        },
      },
    },
    orderBy: { savedAt: 'desc' },
  });
}

export async function toggleSaveProject(userId: string, projectId: string) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) throw createError('Project not found', 404);

  const existing = await prisma.savedProject.findUnique({
    where: { userId_projectId: { userId, projectId } },
  });

  if (existing) {
    await prisma.savedProject.delete({
      where: { userId_projectId: { userId, projectId } },
    });
    return { saved: false };
  } else {
    await prisma.savedProject.create({ data: { userId, projectId } });
    return { saved: true };
  }
}

export async function getSavedIds(userId: string) {
  const [freelancers, projects] = await Promise.all([
    prisma.savedFreelancer.findMany({ where: { userId }, select: { freelancerId: true } }),
    prisma.savedProject.findMany({ where: { userId }, select: { projectId: true } }),
  ]);

  return {
    savedFreelancerIds: freelancers.map((f) => f.freelancerId),
    savedProjectIds: projects.map((p) => p.projectId),
  };
}
