import { Router } from 'express';
import * as ctrl from './proposals.controller';
import { requireAuth, requireFreelancer, requireClient } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { submitProposalSchema, updateProposalStatusSchema } from './proposals.schema';

const router = Router();

// Freelancer: view own proposals
router.get('/me', requireAuth, requireFreelancer, ctrl.myProposals);

// Freelancer: submit proposal
router.post('/projects/:projectId', requireAuth, requireFreelancer, validate(submitProposalSchema), ctrl.submit);

// Client: view proposals for their project
router.get('/projects/:projectId', requireAuth, requireClient, ctrl.projectProposals);

// Client: update proposal status
router.patch('/:proposalId/status', requireAuth, requireClient, validate(updateProposalStatusSchema), ctrl.updateStatus);

export default router;
