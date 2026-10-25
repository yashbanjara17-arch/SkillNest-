import { Router } from 'express';
import * as ctrl from './projects.controller';
import { requireAuth, requireClient } from '../../middleware/auth';
import { validate, validateQuery } from '../../middleware/validate';
import { projectQuerySchema, createProjectSchema, updateProjectSchema } from './projects.schema';

const router = Router();

// Public
router.get('/', validateQuery(projectQuerySchema), ctrl.list);
router.get('/mine', requireAuth, requireClient, ctrl.myProjects);
router.get('/:id', ctrl.getById);

// Client protected
router.post('/', requireAuth, requireClient, validate(createProjectSchema), ctrl.create);
router.patch('/:id', requireAuth, requireClient, validate(updateProjectSchema), ctrl.update);
router.delete('/:id', requireAuth, requireClient, ctrl.remove);

export default router;
