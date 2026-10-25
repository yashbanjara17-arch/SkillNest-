import { Request, Response, NextFunction } from 'express';
import { createError } from './errorHandler';

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  if (!req.session?.userId) {
    return next(createError('Authentication required', 401));
  }
  next();
}

export function requireRole(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.session?.userId) {
      return next(createError('Authentication required', 401));
    }
    if (!roles.includes(req.session.userRole as string)) {
      return next(createError('Insufficient permissions', 403));
    }
    next();
  };
}

export function requireClient(req: Request, res: Response, next: NextFunction): void {
  return requireRole('client')(req, res, next);
}

export function requireFreelancer(req: Request, res: Response, next: NextFunction): void {
  return requireRole('freelancer')(req, res, next);
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  return requireRole('admin')(req, res, next);
}
