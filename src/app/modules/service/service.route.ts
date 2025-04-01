import express from "express";
import { serviceController } from "./service.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { serviceValidation } from "./service.validation";
import { fileUploader } from "../../../helpers/fileUploader";
import { parseBodyMiddleware } from "../../middlewares/parseBodyData";

const router = express.Router();

router.post(
  "/create",
  fileUploader.uploadServiceImage,
  parseBodyMiddleware,
  validateRequest(serviceValidation.createService),
  auth(UserRole.ADMIN),
  serviceController.createService
);
router.get("/", serviceController.getServices);
router.get("/:serviceId", serviceController.getSingleService);
router.put("/:serviceId", auth(), serviceController.likeUnlike);
router.post("/:serviceId", auth(), serviceController.commentCreate);
router.put(
  "/update/:serviceId",
  auth(UserRole.ADMIN),
  serviceController.updateService
);
router.delete(
  "/:serviceId",
  auth(UserRole.ADMIN),
  serviceController.deleteService
);

export const serviceRoutes = router;
