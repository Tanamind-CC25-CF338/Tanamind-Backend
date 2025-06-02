import prisma from '../db';

export const saveDiagnose = async ({
  userId,
  tanaman,
  confidence,
  imageUrl,
  diseaseId,
}: {
  userId: string;
  tanaman: 'TOMAT' | 'CABAI' | 'SELADA';
  confidence: number;
  diseaseId: string;
  imageUrl?: string;
}) => {
  return await prisma.diagnosis.create({
    data: {
      userId,
      tanaman,
      confidence,
      imageUrl,
      diseaseId,
    },
  });
};

export const getDiagnosesByUser = async (userId: string) => {
  return await prisma.diagnosis.findMany({
    where: { userId },
    include: {
      disease: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const getDiagnosisById = async (id: string) => {
  return await prisma.diagnosis.findUnique({
    where: { id },
    include: {
      disease: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};
