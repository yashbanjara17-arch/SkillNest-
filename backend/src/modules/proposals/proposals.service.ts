import { prisma } from '../../config/database';
import { createError } from '../../middleware/errorHandler';
import type { SubmitProposalInput } from './proposals.schema';

export async function submitProposal(userId: string, projectId: string, input: SubmitProposalInput) {
  const freelancerProfile = await prisma.freelancerProfile.findUnique({ where: { userId } });
  if (!freelancerProfile) throw createError('Freelancer profile not found', 404);

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) throw createError('Project not found', 404);
  if (project.status !== 'Open' && project.status !== 'InDiscussion') {
    throw createError('This project is no longer accepting proposals', 400);
  }

  // Check ownership — freelancers cannot propose on their own client's projects
  // (Not applicable since freelancers and clients are separate roles)

  const existing = await prisma.proposal.findUnique({
    where: { projectId_freelancerId: { projectId, freelancerId: freelancerProfile.id } },
  });
  if (existing) throw createError('You have already submitted a proposal for this project', 409);

  const proposal = await prisma.$transaction(async (tx) => {
    const created = await tx.proposal.create({
      data: {
        projectId,
        freelancerId: freelancerProfile.id,
        ...input,
      },
      include: {
        freelancer: {
          include: { user: { select: { name: true, avatarUrl: true, location: true } } },
        },
        project: { select: { title: true } },
      },
    });

    await tx.project.update({
      where: { id: projectId },
      data: { proposalsCount: { increment: 1 } },
    });

    return created;
  });

  return proposal;
}

export async function getMyProposals(userId: string) {
  const profile = await prisma.freelancerProfile.findUnique({ where: { userId } });
  if (!profile) return [];

  return prisma.proposal.findMany({
    where: { freelancerId: profile.id },
    include: {
      project: {
        include: {
          clientProfile: { include: { user: { select: { name: true } } } },
          skills: { include: { skill: true } },
        },
      },
    },
    orderBy: { submittedAt: 'desc' },
  });
}

export async function getProjectProposals(userId: string, projectId: string) {
  // Verify caller owns the project
  const clientProfile = await prisma.clientProfile.findUnique({ where: { userId } });
  if (!clientProfile) throw createError('Client profile not found', 404);

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) throw createError('Project not found', 404);
  if (project.clientProfileId !== clientProfile.id) throw createError('Access denied', 403);

  return prisma.proposal.findMany({
    where: { projectId },
    include: {
      freelancer: {
        include: {
          user: { select: { name: true, avatarUrl: true, location: true } },
          skills: { include: { skill: true } },
        },
      },
    },
    orderBy: { submittedAt: 'desc' },
  });
}

export async function updateProposalStatus(userId: string, proposalId: string, status: string) {
  // Only the project owner (client) can update proposal status
  const clientProfile = await prisma.clientProfile.findUnique({ where: { userId } });
  if (!clientProfile) throw createError('Client profile not found', 404);

  const proposal = await prisma.proposal.findUnique({
    where: { id: proposalId },
    include: { project: true },
  });
  if (!proposal) throw createError('Proposal not found', 404);
  if (proposal.project.clientProfileId !== clientProfile.id) {
    throw createError('You cannot modify this proposal', 403);
  }

  return prisma.proposal.update({
    where: { id: proposalId },
    data: { status: status as 'Pending' | 'Accepted' | 'Negotiating' | 'Declined' },
  });
}
