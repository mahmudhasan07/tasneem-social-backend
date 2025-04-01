import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { categoryServices } from "./category.service";
import sendResponse from "../../../shared/sendResponse";

const createCategory = catchAsync(async (req: any, res: Response) => {
  const { id } = req.user;

  const result = await categoryServices.createCategoryInDB(id, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Category created successfully",
    data: result,
  });
});

const getCategories = catchAsync(async (req: Request, res: Response) => {
  const categories = await categoryServices.getCategoriesFromDB();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Categories retrieved successfully",
    data: categories,
  });
});

const getCategoryById = catchAsync(async (req: Request, res: Response) => {
  const { catId } = req.params;
  const category = await categoryServices.getSingleCategoryFromDB(catId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Category retrieved successfully",
    data: category,
  });
});

export const categoryControllers = {
  createCategory,
  getCategories,
  getCategoryById,
};
