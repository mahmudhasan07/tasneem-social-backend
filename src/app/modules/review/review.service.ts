import { ReviewProvideService } from "@prisma/client";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";

const createReviewInDB = async (
  userId: string,
  serviceId: string,
  payload: ReviewProvideService
) => {
  const isExistReview = await prisma.reviewProvideService.findFirst({
    where: { userId: userId, serviceId: serviceId },
  });
  if (isExistReview) {
    throw new ApiError(409, "Review already exists for this service");
  }

  const result = await prisma.reviewProvideService.create({
    data: {
      ...payload,
      userId: userId,
      serviceId: serviceId,
    },
  });
  return result;
};

const getAllReviewsFromDB = async (req: any) => {
  const { page = 1, limit } = req.query;
  const shouldPaginate = page && limit;
  const skip = shouldPaginate
    ? (parseInt(page) - 1) * parseInt(limit)
    : undefined;
  const take = shouldPaginate ? parseInt(limit) : undefined;

  const reviews = await prisma.reviewProvideService.findMany({
    orderBy: { rating: "desc" },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatar: true,
          reviewProvideService: {
            select: {
              rating: true,
            },
          },
        },
      },
      service: {
        select: {
          service: true,
          category: {
            select: {
              categoryName: true,
            },
          },
        },
      },
    },
    skip,
    take,
  });

  const totalCount = await prisma.reviewProvideService.count();

  if (reviews.length === 0) {
    throw new ApiError(404, "No reviews found");
  }

  const reviewsWithAvgRating = reviews.map((review: any) => {
    const userReviews = review.user.reviewProvideService;
    const totalRating = userReviews.reduce(
      (sum: any, r: any) => sum + r.rating,
      0
    );
    const averageRating = userReviews.length
      ? totalRating / userReviews.length
      : 0;

    return {
      ...review,
      user: {
        ...review.user,
        reviewProvideService: null,
        averageRating: parseFloat(averageRating.toFixed(2)),
      },
    };
  });

  return {
    totalCount,
    totalPages: shouldPaginate ? Math.ceil(totalCount / parseInt(limit)) : 1,
    currentPage: shouldPaginate ? parseInt(page) : 1,
    reviews: reviewsWithAvgRating,
  };
};

export const reviewServices = {
  createReviewInDB,
  getAllReviewsFromDB,
};
