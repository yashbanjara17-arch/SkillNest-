import { Request, Response, NextFunction } from 'express';
import { submitProposal, getMyProposals, getProjectProposals, updateProposalStatus } from './proposals.service';

export async function submit(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await submitProposal(req.session.userId!, req.params.projectId, req.body);
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
}

export async function myProposals(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await getMyProposals(req.session.userId!);
    res.json({ success: true, data });
  } catch (err) { next(err); }
}

export async function projectProposals(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await getProjectProposals(req.session.userId!, req.params.projectId);
    res.json({ success: true, data });
  } catch (err) { next(err); }
}

export async function updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await updateProposalStatus(req.session.userId!, req.params.proposalId, req.body.status);
    res.json({ success: true, data });
  } catch (err) { next(err); }
}
