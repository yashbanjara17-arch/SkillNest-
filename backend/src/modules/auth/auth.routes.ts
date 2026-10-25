import { Router } from 'express';
import { register, login, logout, me } from './auth.controller';
import { validate } from '../../middleware/validate';
import { registerSchema, loginSchema } from './auth.schema';
import { authRateLimiter } from '../../middleware/rateLimiter';

const router = Router();

// POST /api/auth/register
router.post('/register', authRateLimiter, validate(registerSchema), register);

// POST /api/auth/login
router.post('/login', authRateLimiter, validate(loginSchema), login);

// POST /api/auth/logout
router.post('/logout', logout);

// GET /api/auth/me
router.get('/me', me);

export default router;
