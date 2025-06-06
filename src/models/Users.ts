import prisma from '../db';
import { JenisTanaman } from '@prisma/client';

export const findUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  return user;
};

export const findUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  return user;
};

export const findResetPasswordTokenUser = async (
  resetPasswordToken: string
) => {
  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: resetPasswordToken,
    },
  });

  return user;
};

export const createUser = async (userData: any) => {
  const user = await prisma.user.create({ data: userData });

  return user;
};

export const updateResetPasswordToken = async (
  userId: string,
  resetPasswordToken: string | null,
  resetPasswordTokenExpired: Date | null
) => {
  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      resetPasswordToken: resetPasswordToken,
      resetPasswordTokenExpired: resetPasswordTokenExpired,
    },
  });

  return user;
};

export const updatePassword = async (userId: string, newPassword: string) => {
  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: newPassword,
    },
  });

  return user;
};

const isValidJenisTanaman = (value: string): value is JenisTanaman =>
  Object.values(JenisTanaman).includes(value.toUpperCase() as JenisTanaman);

export const createPlanting = async (userId: string, tanaman: string) => {
  const tanamanEnum = tanaman.toUpperCase();

  if (!isValidJenisTanaman(tanamanEnum)) {
    throw new Error(`Jenis tanaman tidak valid: ${tanaman}`);
  }

  return await prisma.planting.create({
    data: {
      userId,
      tanaman: tanamanEnum as JenisTanaman,
    },
  });
};

export const getPlantingsByUser = async (userId: string) => {
  return await prisma.planting.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};

export const markPlantingAsDone = async (id: string) => {
  return await prisma.planting.update({
    where: { id },
    data: { isDone: true },
  });
};
