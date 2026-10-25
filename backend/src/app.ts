import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import helmet from 'helmet';
import cors from 'cors';
import { Pool } from 'pg';

import { env, isProd } from './config/env';
import { notFound, errorHandler } from './middleware/errorHandler';
import { generalRateLimiter } from './middleware/rateLimiter';

// Route modules
import authRoutes from './modules/auth/auth.routes';
import freelancerRoutes from './modules/freelancers/freelancers.routes';
import projectRoutes from './modules/projects/projects.routes';
import proposalRoutes from './modules/proposals/proposals.routes';
import inquiryRoutes from './modules/inquiries/inquiries.routes';
import savedRoutes from './modules/saved/saved.routes';
import reviewRoutes from './modules/reviews/reviews.routes';
import clientRoutes from './modules/clients/clients.routes';
import adminRoutes from './modules/admin/admin.routes';

const PgSession = connectPgSimple(session);

const pgPool = new Pool({ connectionString: env.DATABASE_URL });

export function createApp() {
  const app = express();

  // ── Security Headers ────────────────────────────────────────────────────────
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
    })
  );

  // ── CORS ────────────────────────────────────────────────────────────────────
  app.use(
    cors({
      origin: env.FRONTEND_URL,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Accept'],
    })
  );

  // ── Body Parsing ────────────────────────────────────────────────────────────
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // ── Session ─────────────────────────────────────────────────────────────────
  app.use(
    session({
      store: new PgSession({
        pool: pgPool,
        tableName: 'user_sessions',
        createTableIfMissing: false, // Managed by Prisma migrations
      }),
      name: 'skillnest.sid',
      secret: env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'strict' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      },
    })
  );

  // ── Rate Limiting ───────────────────────────────────────────────────────────
  app.use('/api', generalRateLimiter);

  // ── Health Check ────────────────────────────────────────────────────────────
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // ── API Routes ──────────────────────────────────────────────────────────────
  app.use('/api/auth', authRoutes);
  app.use('/api/freelancers', freelancerRoutes);
  app.use('/api/projects', projectRoutes);
  app.use('/api/proposals', proposalRoutes);
  app.use('/api/inquiries', inquiryRoutes);
  app.use('/api/saved', savedRoutes);
  app.use('/api/reviews', reviewRoutes);
  app.use('/api/clients', clientRoutes);
  app.use('/api/admin', adminRoutes);

  // ── Error Handling ──────────────────────────────────────────────────────────
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
