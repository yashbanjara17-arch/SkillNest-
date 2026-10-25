import { Router } from 'express';
import * as ctrl from './inquiries.controller';
import { requireAuth, requireClient } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { createInquirySchema, sendMessageSchema } from './inquiries.schema';

const router = Router();

// All require authentication
router.use(requireAuth);

router.get('/', ctrl.mine);
router.post('/', requireClient, validate(createInquirySchema), ctrl.create);
router.get('/:inquiryId/messages', ctrl.getMessages);
router.post('/:inquiryId/messages', validate(sendMessageSchema), ctrl.postMessage);

export default router;
