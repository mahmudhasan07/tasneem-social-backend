import { Request } from "express";
import config from "../../../config";
import prisma from "../../../shared/prisma";
import { searchFilter } from "../../../shared/searchFilter";
import ApiError from "../../errors/ApiErrors";

const createProvideServiceInDB = async (req: Request) => {
  const payload = req.body;
  const files = req.file;
  const imageUrl = files
    ? `${config.backend_base_url}/uploads/${files.originalname}`
    : null;
  const existingService = await prisma.provideService.findFirst({
    where: {
      service: payload.service,
    },
  });

  if (existingService) {
    throw new ApiError(409, "Service already provided");
  }

  const result = await prisma.provideService.create({
    data: {
      ...payload,
      image: imageUrl ? imageUrl : "",
    },
  });
  return result;
};

const getSingleProvideServiceFromDB = async (serviceId: string) => {
  const service = await prisma.provideService.findUnique({
    where: { id: serviceId },
  });
  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  return service;
};

const getProvideServices = async (req: any) => {
  const { page = 1, limit, search } = req.query;
  const searchFilters = search ? searchFilter(search) : {};
  const shouldPaginate = page && limit;
  const skip = shouldPaginate
    ? (parseInt(page) - 1) * parseInt(limit)
    : undefined;
  const take = shouldPaginate ? parseInt(limit) : undefined;
  const result = await prisma.provideService.findMany({
    where: searchFilters,
    skip,
    take,
    include: {
      category: {
        select: {
          categoryName: true,
          imageUrl: true,
        },
      },
    },
  });

  const totalCount = await prisma.provideService.count({
    where: searchFilters,
  });

  return {
    totalCount,
    totalPages: shouldPaginate ? Math.ceil(totalCount / parseInt(limit)) : 1,
    currentPage: shouldPaginate ? parseInt(page) : 1,
    result,
  };
};

const updateProvideServiceInDB = async (serviceId: string, payload: any) => {
  const service = await getSingleProvideServiceFromDB(serviceId);
  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  const updatedService = await prisma.provideService.update({
    where: { id: serviceId },
    data: payload,
  });

  return updatedService;
};

const deleteProvideServiceInDB = async (serviceId: string) => {
  const service = await getSingleProvideServiceFromDB(serviceId);
  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  await prisma.provideService.delete({ where: { id: serviceId } });
  return;
};

export const provideServiceServices = {
  createProvideServiceInDB,
  getSingleProvideServiceFromDB,
  getProvideServices,
  updateProvideServiceInDB,
  deleteProvideServiceInDB,
};
