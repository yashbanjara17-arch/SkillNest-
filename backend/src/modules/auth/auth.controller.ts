import { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser, getUserById } from './auth.service';

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await registerUser(req.body);
    const fullUser = await getUserById(user.id as string);

    req.session.userId = user.id as string;
    req.session.userRole = user.role as string;
    req.session.userEmail = user.email as string;

    res.status(201).json({ success: true, data: fullUser || user });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await loginUser(req.body);
    const fullUser = await getUserById(user.id as string);

    req.session.userId = user.id as string;
    req.session.userRole = user.role as string;
    req.session.userEmail = user.email as string;

    res.json({ success: true, data: fullUser || user });
  } catch (err) {
    next(err);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction): Promise<void> {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.clearCookie('skillnest.sid');
    res.json({ success: true, message: 'Signed out successfully' });
  });
}

export async function me(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.session?.userId) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }

    const user = await getUserById(req.session.userId);
    if (!user) {
      req.session.destroy(() => {});
      res.status(401).json({ success: false, error: 'Session invalid' });
      return;
    }

    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}
