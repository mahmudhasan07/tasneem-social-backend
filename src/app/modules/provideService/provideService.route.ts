import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { provideServiceController } from "./provideService.controller";
import validateRequest from "../../middlewares/validateRequest";
import { provideServiceValidation } from "./provideService.validation";
import { fileUploader } from "../../../helpers/fileUploader";
import { parseBodyMiddleware } from "../../middlewares/parseBodyData";

const router = express.Router();

router.post(
  "/create",
  fileUploader.uploadPackageImage,
  parseBodyMiddleware,
  validateRequest(provideServiceValidation.createProvideService),
  auth(UserRole.ADMIN),
  provideServiceController.createProvideService
);
router.get("/", provideServiceController.getProvideServices);
router.get("/:serviceId", provideServiceController.getSingleProvideService);
router.put(
  "/:serviceId",
  auth(UserRole.ADMIN),
  provideServiceController.updateProvideService
);
router.delete(
  "/:serviceId",
  auth(UserRole.ADMIN),
  provideServiceController.deleteProvideService
);

export const provideServiceRoutes = router;
