import { z } from 'zod';

export const updateClientProfileSchema = z.object({
  organization: z.string().max(200).optional(),
  businessType: z.string().max(100).optional(),
  gstNumber: z.string().max(50).optional(),
  tradeLicenseNo: z.string().max(100).optional(),
  businessAddress: z.string().max(500).optional(),
  contactPerson: z.string().max(100).optional(),
  preferredContact: z.string().max(200).optional(),
  websiteUrl: z.string().url().optional().or(z.literal('')),
  // User-level fields
  name: z.string().min(2).max(100).optional(),
  location: z.string().max(200).optional(),
  phone: z.string().max(20).optional(),
  bio: z.string().max(1000).optional(),
  avatarUrl: z.string().url().optional().or(z.literal('')),
});

export type UpdateClientProfileInput = z.infer<typeof updateClientProfileSchema>;
