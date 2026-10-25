import { z } from 'zod';

export const projectQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('12'),
  search: z.string().max(200).optional(),
  category: z.string().optional(),
  status: z.string().optional(),
  area: z.string().optional(),
  minBudget: z.string().regex(/^\d+$/).transform(Number).optional(),
  maxBudget: z.string().regex(/^\d+$/).transform(Number).optional(),
  workerType: z.string().optional(),
  skills: z.string().optional(),
});

export const createProjectSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(300),
  category: z.string().min(1, 'Category is required').max(100),
  description: z.string().min(20, 'Description must be at least 20 characters').max(5000),
  requiredSkills: z.array(z.string().max(50)).optional().default([]),
  clientLocation: z.string().max(200).optional(),
  preferredArea: z.string().max(100).optional(),
  budgetMinInr: z.number().int().positive('Minimum budget must be positive'),
  budgetMaxInr: z.number().int().positive('Maximum budget must be positive'),
  isBudgetNegotiable: z.boolean().default(true),
  timeline: z.string().max(200).optional(),
  preferredWorkerType: z.enum(['IndividualFreelancer', 'AgencyFreelanceTeam', 'Any']).default('Any'),
  contactPreference: z.string().max(200).optional(),
});

export const updateProjectSchema = z.object({
  title: z.string().min(5).max(300).optional(),
  description: z.string().min(20).max(5000).optional(),
  status: z.enum(['Open', 'InDiscussion', 'Assigned', 'Completed', 'Flagged']).optional(),
  budgetMinInr: z.number().int().positive().optional(),
  budgetMaxInr: z.number().int().positive().optional(),
  isBudgetNegotiable: z.boolean().optional(),
  timeline: z.string().max(200).optional(),
  preferredWorkerType: z.enum(['IndividualFreelancer', 'AgencyFreelanceTeam', 'Any']).optional(),
  requiredSkills: z.array(z.string().max(50)).optional(),
});

export type ProjectQuery = z.infer<typeof projectQuerySchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
