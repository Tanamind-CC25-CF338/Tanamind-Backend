import prisma from '../db';

export const getDiseaseByName = async (name: string) => {
  return await prisma.disease.findFirst({
    where: { name },
  });
};

export const getDiseaseById = async (id: string) => {
  return await prisma.disease.findUnique({
    where: { id },
  });
};

export const getAllDiseases = async () => {
  return await prisma.disease.findMany({
    orderBy: { name: 'asc' },
  });
};

export const getDiseaseByLabel = async (label: string) => {
  return await prisma.disease.findFirst({
    where: { label },
  });
};
