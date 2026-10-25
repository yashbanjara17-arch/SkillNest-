import { Router } from 'express';
import { requireAuth, requireAdmin } from '../../middleware/auth';
import { prisma } from '../../config/database';
import { createError } from '../../middleware/errorHandler';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validate } from '../../middleware/validate';

const router = Router();
router.use(requireAuth, requireAdmin);

// ── Dashboard Metrics ─────────────────────────────────────────────────────────
router.get('/metrics', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const [totalUsers, totalFreelancers, totalClients, totalProjects, openProjects,
      totalProposals, totalReviews, pendingReviews] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'freelancer' } }),
      prisma.user.count({ where: { role: 'client' } }),
      prisma.project.count(),
      prisma.project.count({ where: { status: 'Open' } }),
      prisma.proposal.count(),
      prisma.review.count(),
      prisma.review.count({ where: { moderationStatus: 'Pending' } }),
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalFreelancers,
        totalClients,
        totalProjects,
        openProjects,
        totalProposals,
        totalReviews,
        pendingReviews,
      },
    });
  } catch (err) { next(err); }
});

// ── User Management ───────────────────────────────────────────────────────────
router.get('/users', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const search = (req.query.search as string) || '';
    const role = req.query.role as string | undefined;
    const status = req.query.status as string | undefined;

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (role) where.role = role;
    if (status) where.status = status;

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        select: {
          id: true, name: true, email: true, role: true, status: true,
          location: true, createdAt: true, avatarUrl: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    res.json({ success: true, data: users, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
});

const updateUserStatusSchema = z.object({
  status: z.enum(['Active', 'Suspended', 'PendingVerification']),
});

router.patch('/users/:id/status', validate(updateUserStatusSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Prevent admins from suspending themselves
    if (req.params.id === req.session.userId) {
      throw createError('You cannot change your own account status', 400);
    }
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) throw createError('User not found', 404);
    // Prevent changing other admins' status (additional safeguard)
    if (user.role === 'admin') throw createError('Cannot modify admin account status through this endpoint', 403);

    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { status: req.body.status },
      select: { id: true, name: true, email: true, role: true, status: true },
    });

    // Audit log
    await prisma.adminAuditLog.create({
      data: {
        adminId: req.session.userId!,
        action: 'USER_STATUS_UPDATED',
        targetType: 'User',
        targetId: req.params.id,
        details: { newStatus: req.body.status },
      },
    });

    res.json({ success: true, data: updated });
  } catch (err) { next(err); }
});

// ── Project Moderation ────────────────────────────────────────────────────────
router.get('/projects', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const status = req.query.status as string | undefined;

    const where: Record<string, unknown> = {};
    if (status) where.status = status;

    const [total, projects] = await Promise.all([
      prisma.project.count({ where }),
      prisma.project.findMany({
        where,
        include: {
          clientProfile: { include: { user: { select: { name: true, email: true } } } },
          skills: { include: { skill: true } },
          _count: { select: { proposals: true } },
        },
        orderBy: { postedDate: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    res.json({ success: true, data: projects, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
});

const updateProjectStatusSchema = z.object({
  status: z.enum(['Open', 'InDiscussion', 'Assigned', 'Completed', 'Flagged']),
});

router.patch('/projects/:id/status', validate(updateProjectStatusSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const project = await prisma.project.findUnique({ where: { id: req.params.id } });
    if (!project) throw createError('Project not found', 404);

    const updated = await prisma.project.update({
      where: { id: req.params.id },
      data: { status: req.body.status },
    });

    await prisma.adminAuditLog.create({
      data: {
        adminId: req.session.userId!,
        action: 'PROJECT_STATUS_UPDATED',
        targetType: 'Project',
        targetId: req.params.id,
        details: { newStatus: req.body.status },
      },
    });

    res.json({ success: true, data: updated });
  } catch (err) { next(err); }
});

router.delete('/projects/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const project = await prisma.project.findUnique({ where: { id: req.params.id } });
    if (!project) throw createError('Project not found', 404);

    await prisma.project.delete({ where: { id: req.params.id } });

    await prisma.adminAuditLog.create({
      data: {
        adminId: req.session.userId!,
        action: 'PROJECT_DELETED',
        targetType: 'Project',
        targetId: req.params.id,
      },
    });

    res.json({ success: true, message: 'Project deleted' });
  } catch (err) { next(err); }
});

// ── Review Moderation ─────────────────────────────────────────────────────────
router.get('/reviews', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const moderationStatus = req.query.moderationStatus as string | undefined;

    const where: Record<string, unknown> = {};
    if (moderationStatus) where.moderationStatus = moderationStatus;

    const [total, reviews] = await Promise.all([
      prisma.review.count({ where }),
      prisma.review.findMany({
        where,
        include: {
          freelancer: { include: { user: { select: { name: true } } } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    res.json({ success: true, data: reviews, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
});

const updateReviewModerationSchema = z.object({
  moderationStatus: z.enum(['Pending', 'Published', 'Flagged']),
});

router.patch('/reviews/:id/moderation', validate(updateReviewModerationSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const review = await prisma.review.findUnique({ where: { id: req.params.id } });
    if (!review) throw createError('Review not found', 404);

    const updated = await prisma.review.update({
      where: { id: req.params.id },
      data: { moderationStatus: req.body.moderationStatus },
    });

    // Recalculate freelancer rating after moderation change
    const allPublished = await prisma.review.findMany({
      where: { freelancerId: review.freelancerId, moderationStatus: 'Published' },
      select: { rating: true },
    });
    if (allPublished.length > 0) {
      const avg = allPublished.reduce((s, r) => s + r.rating, 0) / allPublished.length;
      await prisma.freelancerProfile.update({
        where: { id: review.freelancerId },
        data: { rating: Math.round(avg * 10) / 10, reviewCount: allPublished.length },
      });
    }

    res.json({ success: true, data: updated });
  } catch (err) { next(err); }
});

// ── Platform Settings ─────────────────────────────────────────────────────────
router.get('/settings', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await prisma.platformSetting.findMany({ orderBy: { key: 'asc' } });
    res.json({ success: true, data: settings });
  } catch (err) { next(err); }
});

const upsertSettingSchema = z.object({
  value: z.string(),
  description: z.string().optional(),
});

router.put('/settings/:key', validate(upsertSettingSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const setting = await prisma.platformSetting.upsert({
      where: { key: req.params.key },
      create: { key: req.params.key, value: req.body.value, description: req.body.description },
      update: { value: req.body.value, description: req.body.description },
    });
    res.json({ success: true, data: setting });
  } catch (err) { next(err); }
});

// ── Freelancer Verification ───────────────────────────────────────────────────
router.patch('/freelancers/:id/verify', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const verifySchema = z.object({ verified: z.boolean() });
    const parsed = verifySchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ success: false, error: 'Invalid body' }); return; }

    const updated = await prisma.freelancerProfile.update({
      where: { id: req.params.id },
      data: { verifiedLocal: parsed.data.verified },
    });

    await prisma.adminAuditLog.create({
      data: {
        adminId: req.session.userId!,
        action: parsed.data.verified ? 'FREELANCER_VERIFIED' : 'FREELANCER_UNVERIFIED',
        targetType: 'FreelancerProfile',
        targetId: req.params.id,
      },
    });

    res.json({ success: true, data: updated });
  } catch (err) { next(err); }
});

export default router;
