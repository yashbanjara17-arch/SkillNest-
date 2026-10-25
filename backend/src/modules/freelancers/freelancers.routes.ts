import { Router } from 'express';
import * as ctrl from './freelancers.controller';
import { requireAuth, requireFreelancer } from '../../middleware/auth';
import { validate, validateQuery } from '../../middleware/validate';
import { freelancerQuerySchema, updateFreelancerSchema, portfolioItemSchema, serviceSchema } from './freelancers.schema';

const router = Router();

// Public
router.get('/', validateQuery(freelancerQuerySchema), ctrl.list);
router.get('/me', requireAuth, requireFreelancer, ctrl.getMe);
router.get('/:id', ctrl.getById);

// Protected (freelancer only)
router.patch('/me', requireAuth, requireFreelancer, validate(updateFreelancerSchema), ctrl.updateMe);
router.post('/me/portfolio', requireAuth, requireFreelancer, validate(portfolioItemSchema), ctrl.addPortfolio);
router.patch('/me/portfolio/:itemId', requireAuth, requireFreelancer, validate(portfolioItemSchema.partial()), ctrl.updatePortfolio);
router.delete('/me/portfolio/:itemId', requireAuth, requireFreelancer, ctrl.removePortfolio);
router.post('/me/services', requireAuth, requireFreelancer, validate(serviceSchema), ctrl.addServiceHandler);
router.patch('/me/services/:serviceId', requireAuth, requireFreelancer, validate(serviceSchema.partial()), ctrl.updateServiceHandler);
router.delete('/me/services/:serviceId', requireAuth, requireFreelancer, ctrl.removeServiceHandler);

export default router;
