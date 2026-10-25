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

const meetingMap: Record<string, 'In-person (Local)' | 'Phone Call' | 'Video Meeting'> = {
  InPersonLocal: 'In-person (Local)',
  PhoneCall: 'Phone Call',
  VideoMeeting: 'Video Meeting',
};

const statusMap: Record<string, 'Unread' | 'Replied' | 'Deal Agreed'> = {
  Unread: 'Unread',
  Replied: 'Replied',
  DealAgreed: 'Deal Agreed',
};

function formatInquiry(inq: any) {
  const meetingPref = meetingMap[inq.meetingPreference] || 'In-person (Local)';
  const status = statusMap[inq.status] || 'Unread';

  return {
    id: inq.id,
    freelancerId: inq.freelancerId,
    freelancerName: inq.freelancer?.user?.name || inq.freelancer?.headline || 'Freelancer',
    freelancerAvatar: inq.freelancer?.user?.avatarUrl || inq.freelancer?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    freelancerLocation: inq.freelancer?.location || inq.freelancer?.areaName || 'Boisar, Maharashtra',
    clientId: inq.clientProfile?.userId || inq.clientProfileId,
    clientName: inq.clientProfile?.user?.name || 'Local Business Client',
    clientEmail: inq.clientProfile?.user?.email || '',
    clientPhone: inq.clientProfile?.user?.phone || undefined,
    projectTitle: inq.projectTitle,
    initialMessage: inq.initialMessage,
    proposedBudgetInr: inq.proposedBudgetInr ?? undefined,
    meetingPreference: meetingPref,
    createdAt: inq.createdAt ? inq.createdAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    status,
    replies: (inq.messages || []).map((m: any) => ({
      senderId: m.senderId,
      senderName: m.sender?.name || (m.senderId === inq.clientProfile?.userId ? inq.clientProfile?.user?.name : inq.freelancer?.user?.name) || 'User',
      message: m.content,
      sentAt: m.sentAt ? m.sentAt.toISOString().replace('T', ' ').substring(0, 16) : new Date().toISOString().replace('T', ' ').substring(0, 16),
    })),
  };
}

export async function createInquiry(userId: string, input: CreateInquiryInput) {
  let clientProfile = await prisma.clientProfile.findUnique({ where: { userId } });
  if (!clientProfile) {
    clientProfile = await prisma.clientProfile.create({
      data: { userId },
    });
  }

  // Look up freelancer either by profile id OR by userId
  let freelancer = await prisma.freelancerProfile.findUnique({
    where: { id: input.freelancerId },
    include: { user: true },
  });
  if (!freelancer) {
    freelancer = await prisma.freelancerProfile.findUnique({
      where: { userId: input.freelancerId },
      include: { user: true },
    });
  }

  // Fallback for mock IDs from seed (e.g. 'fl-1', 'fl-2')
  if (!freelancer && input.freelancerId.startsWith('fl-')) {
    const allFreelancers = await prisma.freelancerProfile.findMany({
      include: { user: true },
      orderBy: { createdAt: 'asc' },
    });
    const index = parseInt(input.freelancerId.replace('fl-', ''), 10) - 1;
    if (index >= 0 && index < allFreelancers.length) {
      freelancer = allFreelancers[index];
    }
  }

  if (!freelancer) throw createError('Freelancer not found', 404);

  const inquiry = await prisma.$transaction(async (tx) => {
    const created = await tx.inquiry.create({
      data: {
        freelancerId: freelancer.id,
        clientProfileId: clientProfile.id,
        projectTitle: input.projectTitle,
        initialMessage: input.initialMessage,
        proposedBudgetInr: input.proposedBudgetInr,
        meetingPreference: input.meetingPreference,
      },
      include: {
        freelancer: { include: { user: true } },
        clientProfile: { include: { user: true } },
      },
    });

    // Create the initial message
    const msg = await tx.message.create({
      data: {
        inquiryId: created.id,
        senderId: userId,
        content: input.initialMessage,
      },
      include: {
        sender: { select: { id: true, name: true } },
      },
    });

    return {
      ...created,
      messages: [msg],
    };
  });

  return formatInquiry(inquiry);
}

export async function getMyInquiries(userId: string, role: string) {
  const inquiryInclude = {
    freelancer: {
      include: { user: { select: { id: true, name: true, avatarUrl: true, location: true } } },
    },
    clientProfile: {
      include: { user: { select: { id: true, name: true, avatarUrl: true, email: true, phone: true } } },
    },
    messages: {
      include: { sender: { select: { id: true, name: true } } },
      orderBy: { sentAt: 'asc' as const },
    },
  };

  if (role === 'client') {
    const profile = await prisma.clientProfile.findUnique({ where: { userId } });
    if (!profile) return [];

    const list = await prisma.inquiry.findMany({
      where: { clientProfileId: profile.id },
      include: inquiryInclude,
      orderBy: { updatedAt: 'desc' },
    });
    return list.map(formatInquiry);
  } else if (role === 'freelancer') {
    const profile = await prisma.freelancerProfile.findUnique({ where: { userId } });
    if (!profile) return [];

    const list = await prisma.inquiry.findMany({
      where: { freelancerId: profile.id },
      include: inquiryInclude,
      orderBy: { updatedAt: 'desc' },
    });
    return list.map(formatInquiry);
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
