import { Request, Response, NextFunction } from 'express';
import {
  listProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getClientProjects,
} from './projects.service';

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await listProjects(req.query as unknown as Parameters<typeof listProjects>[0]);
    res.json({ success: true, ...data });
  } catch (err) { next(err); }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await getProjectById(req.params.id);
    res.json({ success: true, data });
  } catch (err) { next(err); }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await createProject(req.session.userId!, req.body);
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await updateProject(req.session.userId!, req.params.id, req.body);
    res.json({ success: true, data });
  } catch (err) { next(err); }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await deleteProject(req.session.userId!, req.params.id);
    res.json({ success: true, message: 'Project deleted' });
  } catch (err) { next(err); }
}

export async function myProjects(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await getClientProjects(req.session.userId!);
    res.json({ success: true, data });
  } catch (err) { next(err); }
}
