import { z } from 'zod';

export const submitProposalSchema = z.object({
  proposedPriceInr: z.number().int().positive('Price must be a positive number'),
  estimatedTimeline: z.string().min(1).max(200),
  coverMessage: z.string().min(20, 'Cover message must be at least 20 characters').max(2000),
});

export const updateProposalStatusSchema = z.object({
  status: z.enum(['Pending', 'Accepted', 'Negotiating', 'Declined']),
});

export type SubmitProposalInput = z.infer<typeof submitProposalSchema>;
