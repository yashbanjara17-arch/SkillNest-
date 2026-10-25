import 'dotenv/config';
process.env.NODE_ENV = 'test';
// Load .env before any imports so DATABASE_URL is available for Prisma
// Tests use the same skillnest_db (with test-specific cleanup per test)
