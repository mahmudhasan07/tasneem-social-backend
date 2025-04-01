import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { portfolioService } from "./portfolio.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

const createPortfolio = catchAsync(async (req: Request, res: Response) => {
  const result = await portfolioService.createPortfolioIntoDB(req);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Portfolio created successfully",
    data: result,
  });
});

const getPortfolio = catchAsync(async (req: Request, res: Response) => {
  const portfolio = await portfolioService.getAllPortfoliosFromDB();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Portfolio retrieved successfully",
    data: portfolio,
  });
});

const updatePortfolio = catchAsync(async (req: Request, res: Response) => {
  const result = await portfolioService.updatePortfolioInDB(req);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Portfolio updated successfully",
    data: result,
  });
});

const deletePortfolio = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  await portfolioService.deletePortfoliosFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "successfully delete the portfolio",
  });
});

export const portfolioController = {
  createPortfolio,
  getPortfolio,
  updatePortfolio,
  deletePortfolio,
};
