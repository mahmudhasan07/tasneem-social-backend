import express from "express";
import auth from "../../middlewares/auth";
import { reviewController } from "./review.controller";
import validateRequest from "../../middlewares/validateRequest";
import { reviewValidation } from "./review.validation";

const router = express.Router();

router.post(
  "/create/:serviceId",
  validateRequest(reviewValidation.reviewSchema),
  auth(),
  reviewController.reviewCreate
);
router.get("/all-reviews", reviewController.getAllReviews);

export const reviewRoutes = router;
