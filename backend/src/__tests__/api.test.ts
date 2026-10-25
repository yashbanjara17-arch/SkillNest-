import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import supertest from 'supertest';
import { createApp } from '../app';
import { prisma } from '../config/database';

const app = createApp();
const request = supertest(app);

// ── DB Connectivity ────────────────────────────────────────────────────────────
describe('Database', () => {
  it('connects to PostgreSQL', async () => {
    const result = await prisma.$queryRaw<[{ now: Date }]>`SELECT NOW()`;
    expect(result[0].now).toBeInstanceOf(Date);
  });
});

// ── Health Check ────────────────────────────────────────────────────────────────
describe('Health', () => {
  it('GET /health returns ok', async () => {
    const res = await request.get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

// ── Auth ──────────────────────────────────────────────────────────────────────
describe('Auth', () => {
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'TestPassword@123';

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: testEmail } });
  });

  it('POST /api/auth/register — creates a client account', async () => {
    const res = await request.post('/api/auth/register').send({
      name: 'Test Client',
      email: testEmail,
      password: testPassword,
      role: 'client',
    });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe(testEmail);
    expect(res.body.data.passwordHash).toBeUndefined();
  });

  it('POST /api/auth/register — rejects duplicate email', async () => {
    const res = await request.post('/api/auth/register').send({
      name: 'Duplicate',
      email: testEmail,
      password: testPassword,
      role: 'client',
    });
    expect(res.status).toBe(409);
  });

  it('POST /api/auth/register — rejects admin role', async () => {
    const res = await request.post('/api/auth/register').send({
      name: 'Evil Admin',
      email: `admin-${Date.now()}@evil.com`,
      password: testPassword,
      role: 'admin',
    });
    expect(res.status).toBe(400);
  });

  it('POST /api/auth/login — succeeds with correct credentials', async () => {
    const res = await request.post('/api/auth/login').send({
      email: testEmail,
      password: testPassword,
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.passwordHash).toBeUndefined();
  });

  it('POST /api/auth/login — rejects wrong password', async () => {
    const res = await request.post('/api/auth/login').send({
      email: testEmail,
      password: 'WrongPassword@999',
    });
    expect(res.status).toBe(401);
  });

  it('GET /api/auth/me — returns 401 when unauthenticated', async () => {
    const res = await request.get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('POST /api/auth/logout — works', async () => {
    const agent = supertest.agent(app);
    await agent.post('/api/auth/login').send({ email: testEmail, password: testPassword });
    const res = await agent.post('/api/auth/logout');
    expect(res.status).toBe(200);
    // After logout, /me should return 401
    const meRes = await agent.get('/api/auth/me');
    expect(meRes.status).toBe(401);
  });
});

// ── Role-Based Access Control ─────────────────────────────────────────────────
describe('RBAC', () => {
  const clientEmail = `rbac-client-${Date.now()}@example.com`;
  const flEmail = `rbac-fl-${Date.now()}@example.com`;
  const password = 'TestPassword@123';

  beforeAll(async () => {
    await request.post('/api/auth/register').send({ name: 'RBAC Client', email: clientEmail, password, role: 'client' });
    await request.post('/api/auth/register').send({ name: 'RBAC Freelancer', email: flEmail, password, role: 'freelancer' });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: { in: [clientEmail, flEmail] } } });
  });

  it('GET /api/admin/metrics — returns 403 for a client', async () => {
    const agent = supertest.agent(app);
    await agent.post('/api/auth/login').send({ email: clientEmail, password });
    const res = await agent.get('/api/admin/metrics');
    expect(res.status).toBe(403);
  });

  it('GET /api/admin/metrics — returns 403 for a freelancer', async () => {
    const agent = supertest.agent(app);
    await agent.post('/api/auth/login').send({ email: flEmail, password });
    const res = await agent.get('/api/admin/metrics');
    expect(res.status).toBe(403);
  });

  it('POST /api/projects — returns 403 for a freelancer', async () => {
    const agent = supertest.agent(app);
    await agent.post('/api/auth/login').send({ email: flEmail, password });
    const res = await agent.post('/api/projects').send({
      title: 'Test project by freelancer',
      category: 'Web',
      description: 'This should fail because freelancer cannot post projects',
      budgetMinInr: 5000,
      budgetMaxInr: 10000,
    });
    expect(res.status).toBe(403);
  });

  it('POST /api/proposals/projects/:id — returns 403 for a client', async () => {
    const agent = supertest.agent(app);
    await agent.post('/api/auth/login').send({ email: clientEmail, password });
    const res = await agent.post('/api/proposals/projects/some-project-id').send({
      proposedPriceInr: 10000,
      estimatedTimeline: '2 weeks',
      coverMessage: 'This should fail because clients cannot submit proposals',
    });
    expect(res.status).toBe(403);
  });
});

// ── Validation ────────────────────────────────────────────────────────────────
describe('Validation', () => {
  it('POST /api/auth/register — rejects missing fields', async () => {
    const res = await request.post('/api/auth/register').send({ email: 'nope@test.com' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/auth/login — rejects invalid email format', async () => {
    const res = await request.post('/api/auth/login').send({ email: 'not-an-email', password: 'pass' });
    expect(res.status).toBe(400);
  });
});

// ── Public Endpoints ──────────────────────────────────────────────────────────
describe('Public Endpoints', () => {
  it('GET /api/freelancers — returns paginated list', async () => {
    const res = await request.get('/api/freelancers');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body).toHaveProperty('total');
    expect(res.body).toHaveProperty('totalPages');
  });

  it('GET /api/projects — returns paginated list', async () => {
    const res = await request.get('/api/projects');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.items)).toBe(true);
  });

  it('GET /api/freelancers/:id — returns 404 for unknown id', async () => {
    const res = await request.get('/api/freelancers/nonexistent-id-xyz');
    expect(res.status).toBe(404);
  });
});
