import { Router } from "express";
import { fileUploader } from "../../../helpers/fileUploader";
import { parseBodyMiddleware } from "../../middlewares/parseBodyData";
import validateRequest from "../../middlewares/validateRequest";
import { portfolioValidation } from "./portfolio.validation";
import { portfolioController } from "./portfolio.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.post(
  "/create",
  auth(UserRole.ADMIN),
  fileUploader.uploadPortifiloImage,
  parseBodyMiddleware,
  validateRequest(portfolioValidation.portfolioSchema),
  portfolioController.createPortfolio
);

router.get("/", portfolioController.getPortfolio);

router.patch(
  "/:id",
  auth(UserRole.ADMIN),
  fileUploader.uploadPortifiloImage,
  parseBodyMiddleware,
  validateRequest(portfolioValidation.portfolioSchema),
  portfolioController.updatePortfolio
);

router.delete(
  "/:id",
  auth(UserRole.ADMIN),
  portfolioController.deletePortfolio
);

export const portfolioRoute = router;
