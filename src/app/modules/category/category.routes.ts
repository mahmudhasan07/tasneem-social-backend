import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { categoryControllers } from "./category.controller";

const router = express.Router();

router.post(
  "/create",
  auth(UserRole.ADMIN),
  categoryControllers.createCategory
);

router.get("/", categoryControllers.getCategories);
router.get("/:catId", categoryControllers.getCategoryById);

export const categoryRoutes = router;
