import argon2 from 'argon2';
import { prisma } from '../../config/database';
import { createError } from '../../middleware/errorHandler';
import type { RegisterInput, LoginInput } from './auth.schema';

export async function registerUser(input: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw createError('An account with this email already exists', 409);
  }

  const passwordHash = await argon2.hash(input.password, {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
  });

  const user = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash,
        role: input.role as 'client' | 'freelancer',
        location: input.location,
        phone: input.phone,
      },
    });

    // Create corresponding profile
    if (input.role === 'client') {
      await tx.clientProfile.create({
        data: {
          userId: newUser.id,
          organization: input.organization,
        },
      });
    } else if (input.role === 'freelancer') {
      await tx.freelancerProfile.create({
        data: {
          userId: newUser.id,
        },
      });
    }

    return newUser;
  });

  return sanitizeUser(user);
}

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) {
    // Constant-time to prevent email enumeration
    await argon2.hash('dummy-constant-time-comparison');
    throw createError('Invalid email or password', 401);
  }

  if (user.status === 'Suspended') {
    throw createError('Your account has been suspended. Contact support.', 403);
  }

  const valid = await argon2.verify(user.passwordHash, input.password);
  if (!valid) {
    throw createError('Invalid email or password', 401);
  }

  return sanitizeUser(user);
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      clientProfile: true,
      freelancerProfile: {
        include: {
          skills: { include: { skill: true } },
        },
      },
    },
  });
  if (!user) return null;
  return sanitizeUser(user);
}

function sanitizeUser(user: unknown) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash: _passwordHash, ...safe } = user as Record<string, unknown> & { passwordHash: unknown };
  return safe;
}
