import { Request, Response, NextFunction } from 'express';
import { createInquiry, getMyInquiries, getInquiryMessages, sendMessage } from './inquiries.service';

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await createInquiry(req.session.userId!, req.body);
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
}

export async function mine(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await getMyInquiries(req.session.userId!, req.session.userRole!);
    res.json({ success: true, data });
  } catch (err) { next(err); }
}

export async function getMessages(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await getInquiryMessages(req.session.userId!, req.params.inquiryId);
    res.json({ success: true, data });
  } catch (err) { next(err); }
}

export async function postMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await sendMessage(req.session.userId!, req.params.inquiryId, req.body);
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
}
