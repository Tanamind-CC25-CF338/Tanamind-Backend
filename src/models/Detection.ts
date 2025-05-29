import prisma from '../db';

export const saveDiagnose = async ({
  userId,
  tanaman,
  hasil,
  confidence,
  ciri,
  solusi,
  imageUrl,
}: {
  userId: string;
  tanaman: string;
  hasil: string;
  confidence: number;
  ciri: string[];
  solusi: string[];
  imageUrl?: string;
}) => {
  const diagnosis = await prisma.diagnosis.create({
    data: {
      userId,
      tanaman,
      hasil,
      confidence,
      ciri,
      solusi,
      imageUrl,
    },
  });

  return diagnosis;
};

export const getDiagnosesByUser = async (userId: string) => {
  return prisma.diagnosis.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};
