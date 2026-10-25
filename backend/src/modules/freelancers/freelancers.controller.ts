import { Request, Response, NextFunction } from 'express';
import {
  listFreelancers,
  getFreelancerById,
  getFreelancerByUserId,
  updateFreelancerProfile,
  addPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  addService,
  updateService,
  deleteService,
} from './freelancers.service';

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await listFreelancers(req.query as unknown as Parameters<typeof listFreelancers>[0]);
    res.json({ success: true, ...data });
  } catch (err) { next(err); }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await getFreelancerById(req.params.id);
    res.json({ success: true, data });
  } catch (err) { next(err); }
}

export async function getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await getFreelancerByUserId(req.session.userId!);
    if (!data) { res.status(404).json({ success: false, error: 'Profile not found' }); return; }
    res.json({ success: true, data });
  } catch (err) { next(err); }
}

export async function updateMe(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await updateFreelancerProfile(req.session.userId!, req.body);
    res.json({ success: true, data });
  } catch (err) { next(err); }
}

export async function addPortfolio(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await addPortfolioItem(req.session.userId!, req.body);
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
}

export async function updatePortfolio(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await updatePortfolioItem(req.session.userId!, req.params.itemId, req.body);
    res.json({ success: true, data });
  } catch (err) { next(err); }
}

export async function removePortfolio(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await deletePortfolioItem(req.session.userId!, req.params.itemId);
    res.json({ success: true, message: 'Portfolio item removed' });
  } catch (err) { next(err); }
}

export async function addServiceHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await addService(req.session.userId!, req.body);
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
}

export async function updateServiceHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await updateService(req.session.userId!, req.params.serviceId, req.body);
    res.json({ success: true, data });
  } catch (err) { next(err); }
}

export async function removeServiceHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await deleteService(req.session.userId!, req.params.serviceId);
    res.json({ success: true, message: 'Service removed' });
  } catch (err) { next(err); }
}
