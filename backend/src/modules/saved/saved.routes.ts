import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { getSavedFreelancers, toggleSaveFreelancer, getSavedProjects, toggleSaveProject, getSavedIds } from './saved.service';

const router = Router();
router.use(requireAuth);

router.get('/ids', async (req, res, next) => {
  try {
    const data = await getSavedIds(req.session.userId!);
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

router.get('/freelancers', async (req, res, next) => {
  try {
    const data = await getSavedFreelancers(req.session.userId!);
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

router.post('/freelancers/:id', async (req, res, next) => {
  try {
    const data = await toggleSaveFreelancer(req.session.userId!, req.params.id);
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

router.get('/projects', async (req, res, next) => {
  try {
    const data = await getSavedProjects(req.session.userId!);
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

router.post('/projects/:id', async (req, res, next) => {
  try {
    const data = await toggleSaveProject(req.session.userId!, req.params.id);
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

export default router;
