import prisma from '../db';

// Simpan hasil diagnosis ke database
export const saveDiagnose = async ({
  userId,
  tanaman,
  confidence,
  imageUrl,
  diseaseId,
}: {
  userId: string;
  tanaman: 'TOMAT' | 'CABAI' | 'SELADA'; // enum Tanaman
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

// Ambil semua diagnosis berdasarkan user
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

// Ambil detail diagnosis berdasarkan ID
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
