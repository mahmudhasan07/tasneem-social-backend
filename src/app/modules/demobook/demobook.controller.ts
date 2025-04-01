import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { demoBookServices } from "./demobook.service";
import sendResponse from "../../../shared/sendResponse";

const createDemoBook = catchAsync(async (req: Request, res: Response) => {
  const result = await demoBookServices.createDemoBookInDB(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Demo book created successfully",
    data: result,
  });
});

const getDemoBook = catchAsync(async (req: Request, res: Response) => {
  const { bookId } = req.params;
  const demoBook = await demoBookServices.getDemoBook(bookId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Demo book retrieved successfully",
    data: demoBook,
  });
});

const getDemoBooks = catchAsync(async (req: Request, res: Response) => {
  const demoBooks = await demoBookServices.getDemoBooks(req);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Demo books retrieved successfully",
    data: demoBooks,
  });
});

const responseBookedRequest = catchAsync(
  async (req: Request, res: Response) => {
    const { bookedId } = req.params;
    await demoBookServices.responseDemoBooked(bookedId, req.body);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Booked request status updated successfully",
    });
  }
);

const deleteDemoBook = catchAsync(async (req: Request, res: Response) => {
  const { bookedId } = req.params;
  await demoBookServices.demobookDeleteInDB(bookedId);
  sendResponse(res, {
    statusCode: 204,
    success: true,
    message: "Demo book deleted successfully",
  });
});

export const demobookControllers = {
  createDemoBook,
  getDemoBook,
  getDemoBooks,
  responseBookedRequest,
  deleteDemoBook,
};
