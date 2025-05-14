import prisma from '../db';

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
