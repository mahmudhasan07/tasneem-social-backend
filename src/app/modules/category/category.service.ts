import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";

const createCategoryInDB = async (adminId: string, payload: any) => {
  const existingCategory = await prisma.category.findFirst({
    where: { categoryName: payload.categoryName },
  });

  if (existingCategory) {
    throw new ApiError(409, "Category already exists");
  }

  const result = await prisma.category.create({
    data: {
      ...payload,
      adminId: adminId,
    },
  });

  return result;
};

const getCategoriesFromDB = async () => {
  const result = await prisma.category.findMany();
  return result;
};

const getSingleCategoryFromDB = async (catId: string) => {
  const result = await prisma.category.findUnique({
    where: { id: catId },
    include: {
      sevice: true,
      provideService: true,
    },
  });
  return result;
};

export const categoryServices = {
  createCategoryInDB,
  getCategoriesFromDB,
  getSingleCategoryFromDB,
};
