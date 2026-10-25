import { z } from 'zod';

export const createInquirySchema = z.object({
  freelancerId: z.string().cuid('Invalid freelancer ID'),
  projectTitle: z.string().min(3).max(300),
  initialMessage: z.string().min(10, 'Message must be at least 10 characters').max(2000),
  proposedBudgetInr: z.number().int().positive().optional(),
  meetingPreference: z.enum(['InPersonLocal', 'PhoneCall', 'VideoMeeting']).default('InPersonLocal'),
});

export const sendMessageSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty').max(2000),
});

export type CreateInquiryInput = z.infer<typeof createInquirySchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
