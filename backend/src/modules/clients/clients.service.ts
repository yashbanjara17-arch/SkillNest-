import { prisma } from '../../config/database';
import { Prisma } from '@prisma/client';
import { createError } from '../../middleware/errorHandler';
import type { UpdateClientProfileInput } from './clients.schema';

export async function getClientProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { clientProfile: true },
  });
  if (!user) throw createError('User not found', 404);
  const { passwordHash: _pw, ...safeUser } = user as typeof user & { passwordHash: string };
  return safeUser;
}

export async function updateClientProfile(userId: string, input: UpdateClientProfileInput) {
  const { name, location, phone, bio, avatarUrl, ...profileData } = input;

  // Separate user-level vs profile-level updates
  const userUpdates: Record<string, unknown> = {};
  if (name !== undefined) userUpdates.name = name;
  if (location !== undefined) userUpdates.location = location;
  if (phone !== undefined) userUpdates.phone = phone;
  if (bio !== undefined) userUpdates.bio = bio;
  if (avatarUrl !== undefined) userUpdates.avatarUrl = avatarUrl || null;

  const updated = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    if (Object.keys(userUpdates).length > 0) {
      await tx.user.update({ where: { id: userId }, data: userUpdates });
    }

    await tx.clientProfile.upsert({
      where: { userId },
      create: { userId, ...profileData },
      update: profileData,
    });

    return tx.user.findUnique({
      where: { id: userId },
      include: { clientProfile: true },
    });
  });

  const { passwordHash: _pw, ...safe } = updated as typeof updated & { passwordHash: string };
  return safe;
}
