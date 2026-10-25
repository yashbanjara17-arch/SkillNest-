import { z } from 'zod';

export const createReviewSchema = z.object({
  freelancerId: z.string().cuid('Invalid freelancer ID'),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, 'Review must be at least 10 characters').max(1000),
  projectTitle: z.string().max(300).optional(),
  clientCompany: z.string().max(200).optional(),
  clientLocation: z.string().max(200).optional(),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
