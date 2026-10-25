import { z } from 'zod';

export const freelancerQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('12'),
  search: z.string().max(100).optional(),
  category: z.string().optional(),
  area: z.string().optional(),
  availability: z.string().optional(),
  isTeam: z.enum(['true', 'false']).optional(),
  minRate: z.string().regex(/^\d+$/).transform(Number).optional(),
  maxRate: z.string().regex(/^\d+$/).transform(Number).optional(),
  skills: z.string().optional(), // comma-separated
  verifiedOnly: z.enum(['true', 'false']).optional(),
});

export const updateFreelancerSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  avatarUrl: z.string().optional().or(z.literal('')).nullable(),
  headline: z.string().max(200).optional(),
  bio: z.string().max(2000).optional(),
  location: z.string().max(200).optional(),
  areaName: z.string().max(100).optional(),
  distanceFromBoisarKm: z.number().nonnegative().optional(),
  isTeam: z.boolean().optional(),
  teamSize: z.number().int().positive().optional().nullable(),
  teamMemberNames: z.array(z.string()).optional(),
  hourlyRateInr: z.number().int().nonnegative().optional(),
  startingProjectRateInr: z.number().int().nonnegative().optional(),
  availability: z.enum([
    'AvailableImmediately',
    'PartTimeAvailable',
    'BookedAvailableNextMonth',
    'WeekendsOnly',
  ]).optional(),
  experienceYears: z.number().int().nonnegative().optional(),
  category: z.enum([
    'WebAndAppDevelopment',
    'UIUXAndGraphicDesign',
    'DigitalMarketingAndSEO',
    'VideoAndMediaProduction',
    'IndustrialAndCADEngineering',
    'ContentAndCopywriting',
  ]).optional(),
  languages: z.array(z.string()).optional(),
  contactPreference: z.enum([
    'PhoneAndWhatsApp',
    'EmailAndSkillNestDirect',
    'InPersonMeetingFirst',
  ]).optional(),
  skills: z.array(z.string().max(50)).optional(),
});

export const portfolioItemSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().min(5).max(2000),
  imageUrl: z.string().min(1).optional().nullable(),
  category: z.string().max(100).optional().nullable(),
  completionYear: z.string().max(10).optional().nullable(),
  clientType: z.string().max(100).optional().nullable(),
  skillsUsed: z.array(z.string()).optional().default([]),
  liveUrl: z.string().min(1).optional().or(z.literal('')).nullable(),
});

export const serviceSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().min(5).max(2000),
  startingPriceInr: z.number().int().nonnegative(),
  deliveryTimeDays: z.number().int().positive(),
});

export type FreelancerQuery = z.infer<typeof freelancerQuerySchema>;
export type UpdateFreelancerInput = z.infer<typeof updateFreelancerSchema>;
export type PortfolioItemInput = z.infer<typeof portfolioItemSchema>;
export type ServiceInput = z.infer<typeof serviceSchema>;
