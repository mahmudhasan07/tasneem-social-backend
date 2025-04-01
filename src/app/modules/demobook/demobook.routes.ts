import express from "express";
import { demobookControllers } from "./demobook.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { demoBookValidation } from "./demobook.validation";

const router = express.Router();

router.post(
  "/send",
  validateRequest(demoBookValidation.demoBookValidationSchema),
  demobookControllers.createDemoBook
);
router.get("/:bookedId", auth(UserRole.ADMIN), demobookControllers.getDemoBook);
router.get("/", auth(UserRole.ADMIN), demobookControllers.getDemoBooks);
router.delete(
  "/:bookedId",
  auth(UserRole.ADMIN),
  demobookControllers.deleteDemoBook
);
router.put(
  "/:bookedId",
  auth(UserRole.ADMIN),
  demobookControllers.responseBookedRequest
);

export const demobookRotes = router;
