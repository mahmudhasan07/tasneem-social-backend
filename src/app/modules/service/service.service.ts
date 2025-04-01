import { Request } from "express";
import prisma from "../../../shared/prisma";
import { searchFilter } from "../../../shared/searchFilter";
import ApiError from "../../errors/ApiErrors";
import config from "../../../config";

const createServiceInDB = async (req: Request) => {
  const payload = req.body;
  const files = req.file;
  const imageUrl = files
    ? `${config.backend_base_url}/uploads/${files.originalname}`
    : null;
  const existingService = await prisma.service.findFirst({
    where: {
      description: payload.description,
    },
  });

  if (existingService) {
    throw new ApiError(409, "Service already provided");
  }
  const result = await prisma.service.create({
    data: {
      ...payload,
      image: imageUrl ? imageUrl : "",
    },
  });
  return result;
};

const getSingleServiceFromDB = async (serviceId: string) => {
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    include: {
      comment: {
        select: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          comment: true,
        },
      },
    },
  });
  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  return service;
};

const getServicesFromDB = async (req: any) => {
  const { page = 1, limit, search } = req.query;
  const searchFilters = search ? searchFilter(search) : {};
  const shouldPaginate = page && limit;
  const skip = shouldPaginate
    ? (parseInt(page) - 1) * parseInt(limit)
    : undefined;
  const take = shouldPaginate ? parseInt(limit) : undefined;
  const result = await prisma.service.findMany({
    where: searchFilters,
    skip,
    take,
    include: {
      comment: {
        select: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          comment: true,
        },
      },
    },
  });

  const totalCount = await prisma.service.count({ where: searchFilters });

  return {
    totalCount,
    totalPages: shouldPaginate ? Math.ceil(totalCount / parseInt(limit)) : 1,
    currentPage: shouldPaginate ? parseInt(page) : 1,
    result,
  };
};

const likeUnlikeInDB = async (serviceId: string, userId: string) => {
  const existingLike = await prisma.service.findUnique({
    where: {
      id: serviceId,
      likedIds: {
        has: userId,
      },
    },
  });

  if (existingLike) {
    const result = await prisma.service.update({
      where: { id: serviceId },
      data: {
        likedIds: {
          set: existingLike.likedIds.filter((id) => id !== userId),
        },
      },
    });
    return result;
  }

  const result = await prisma.service.update({
    where: { id: serviceId },
    data: {
      likedIds: {
        push: userId,
      },
    },
  });
  return result;
};

const commnetInService = async (
  comment: string,
  serviceId: string,
  userId: string
) => {
  const result = await prisma.comment.create({
    data: {
      comment,
      serviceId,
      userId,
    },
  });
  return result;
};

const updateServiceInDB = async (serviceId: string, payload: any) => {
  const isExisting = await getSingleServiceFromDB(serviceId);
  if (!isExisting) {
    throw new ApiError(404, "Service not found");
  }

  const result = await prisma.service.update({
    where: { id: serviceId },
    data: payload,
  });
  return result;
};

const deleteServiceInDB = async (serviceId: string) => {
  const isExisting = await getSingleServiceFromDB(serviceId);
  if (!isExisting) {
    throw new ApiError(404, "Service not found");
  }

  await prisma.service.delete({ where: { id: serviceId } });
  return;
};

export const serviceServices = {
  createServiceInDB,
  getSingleServiceFromDB,
  getServicesFromDB,
  likeUnlikeInDB,
  commnetInService,
  updateServiceInDB,
  deleteServiceInDB,
};
