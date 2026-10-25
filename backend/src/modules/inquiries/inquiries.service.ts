import { prisma } from '../../config/database';
import { createError } from '../../middleware/errorHandler';
import type { CreateInquiryInput, SendMessageInput } from './inquiries.schema';

async function verifyInquiryAccess(userId: string, inquiryId: string) {
  const inquiry = await prisma.inquiry.findUnique({
    where: { id: inquiryId },
    include: {
      clientProfile: { select: { userId: true } },
      freelancer: { select: { userId: true } },
    },
  });

  if (!inquiry) throw createError('Inquiry not found', 404);

  const isClient = inquiry.clientProfile.userId === userId;
  const isFreelancer = inquiry.freelancer.userId === userId;

  if (!isClient && !isFreelancer) {
    throw createError('You do not have access to this conversation', 403);
  }

  return inquiry;
}

export async function createInquiry(userId: string, input: CreateInquiryInput) {
  const clientProfile = await prisma.clientProfile.findUnique({ where: { userId } });
  if (!clientProfile) throw createError('Client profile not found', 404);

  const freelancer = await prisma.freelancerProfile.findUnique({
    where: { id: input.freelancerId },
  });
  if (!freelancer) throw createError('Freelancer not found', 404);

  const inquiry = await prisma.$transaction(async (tx) => {
    const created = await tx.inquiry.create({
      data: {
        freelancerId: input.freelancerId,
        clientProfileId: clientProfile.id,
        projectTitle: input.projectTitle,
        initialMessage: input.initialMessage,
        proposedBudgetInr: input.proposedBudgetInr,
        meetingPreference: input.meetingPreference,
      },
    });

    // Create the initial message
    await tx.message.create({
      data: {
        inquiryId: created.id,
        senderId: userId,
        content: input.initialMessage,
      },
    });

    return created;
  });

  return inquiry;
}

export async function getMyInquiries(userId: string, role: string) {
  if (role === 'client') {
    const profile = await prisma.clientProfile.findUnique({ where: { userId } });
    if (!profile) return [];

    return prisma.inquiry.findMany({
      where: { clientProfileId: profile.id },
      include: {
        freelancer: {
          include: { user: { select: { name: true, avatarUrl: true } } },
        },
        messages: { orderBy: { sentAt: 'asc' }, take: 1 },
      },
      orderBy: { updatedAt: 'desc' },
    });
  } else if (role === 'freelancer') {
    const profile = await prisma.freelancerProfile.findUnique({ where: { userId } });
    if (!profile) return [];

    return prisma.inquiry.findMany({
      where: { freelancerId: profile.id },
      include: {
        clientProfile: {
          include: { user: { select: { name: true, avatarUrl: true } } },
        },
        messages: { orderBy: { sentAt: 'asc' }, take: 1 },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  return [];
}

export async function getInquiryMessages(userId: string, inquiryId: string) {
  await verifyInquiryAccess(userId, inquiryId);

  return prisma.message.findMany({
    where: { inquiryId },
    include: {
      sender: { select: { id: true, name: true, avatarUrl: true, role: true } },
    },
    orderBy: { sentAt: 'asc' },
  });
}

export async function sendMessage(userId: string, inquiryId: string, input: SendMessageInput) {
  const inquiry = await verifyInquiryAccess(userId, inquiryId);

  const message = await prisma.$transaction(async (tx) => {
    const msg = await tx.message.create({
      data: {
        inquiryId,
        senderId: userId,
        content: input.content,
      },
      include: {
        sender: { select: { id: true, name: true, avatarUrl: true, role: true } },
      },
    });

    await tx.inquiry.update({
      where: { id: inquiryId },
      data: { status: 'Replied', updatedAt: new Date() },
    });

    return msg;
  });

  return message;
}
