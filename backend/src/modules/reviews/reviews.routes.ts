import { Router } from 'express';
import { requireAuth, requireClient } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { createReviewSchema } from './reviews.schema';
import { prisma } from '../../config/database';
import { createError } from '../../middleware/errorHandler';
import { Request, Response, NextFunction } from 'express';

const router = Router();

// Get reviews for a freelancer (public)
router.get('/freelancer/:freelancerId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        freelancerId: req.params.freelancerId,
        moderationStatus: 'Published',
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: reviews });
  } catch (err) { next(err); }
});

// Create a review (client only)
router.post('/', requireAuth, requireClient, validate(createReviewSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.session.userId! },
      include: { clientProfile: true },
    });
    if (!user || !user.clientProfile) throw createError('Client profile not found', 404);

    const freelancer = await prisma.freelancerProfile.findUnique({
      where: { id: req.body.freelancerId },
    });
    if (!freelancer) throw createError('Freelancer not found', 404);

    const review = await prisma.$transaction(async (tx) => {
      const created = await tx.review.create({
        data: {
          freelancerId: req.body.freelancerId,
          clientName: user.name,
          clientCompany: req.body.clientCompany,
          clientLocation: req.body.clientLocation || user.location,
          rating: req.body.rating,
          comment: req.body.comment,
          projectTitle: req.body.projectTitle,
          verified: true,
          moderationStatus: 'Published',
        },
      });

      // Update freelancer aggregate rating
      const allReviews = await tx.review.findMany({
        where: { freelancerId: req.body.freelancerId, moderationStatus: 'Published' },
        select: { rating: true },
      });
      const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

      await tx.freelancerProfile.update({
        where: { id: req.body.freelancerId },
        data: {
          rating: Math.round(avgRating * 10) / 10,
          reviewCount: allReviews.length,
        },
      });

      return created;
    });

    res.status(201).json({ success: true, data: review });
  } catch (err) { next(err); }
});

export default router;
