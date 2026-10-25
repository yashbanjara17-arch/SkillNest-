import { Router } from 'express';
import { requireAuth, requireClient } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { updateClientProfileSchema } from './clients.schema';
import { getClientProfile, updateClientProfile } from './clients.service';
import { Request, Response, NextFunction } from 'express';

const router = Router();

router.use(requireAuth, requireClient);

router.get('/me', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getClientProfile(req.session.userId!);
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

router.patch('/me', validate(updateClientProfileSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await updateClientProfile(req.session.userId!, req.body);
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

export default router;
