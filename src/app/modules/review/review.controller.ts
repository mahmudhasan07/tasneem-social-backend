import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { reviewServices } from "./review.service";
import sendResponse from "../../../shared/sendResponse";

const reviewCreate = catchAsync(async (req: any, res: Response) => {
  const { serviceId } = req.params;
  const userId = req.user.id;

  const result = await reviewServices.createReviewInDB(
    userId,
    serviceId,
    req.body
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Review created successfully",
    data: result,
  });
});

const getAllReviews = catchAsync(async (req: Request, res: Response) => {
  const result = await reviewServices.getAllReviewsFromDB(req);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Reviews retrieved successfully",
    data: result,
  });
});

export const reviewController = {
  reviewCreate,
  getAllReviews,
};
