import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { provideServiceServices } from "./provideService.service";
import sendResponse from "../../../shared/sendResponse";

const createProvideService = catchAsync(async (req: Request, res: Response) => {
  const service = await provideServiceServices.createProvideServiceInDB(req);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Provide service created successfully",
    data: service,
  });
});

const getSingleProvideService = catchAsync(
  async (req: Request, res: Response) => {
    const { serviceId } = req.params;
    const service = await provideServiceServices.getSingleProvideServiceFromDB(
      serviceId
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Provide service retrived successfully",
      data: service,
    });
  }
);

const getProvideServices = catchAsync(async (req: Request, res: Response) => {
  const services = await provideServiceServices.getProvideServices(req);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "get all provide services returned successfully",
    data: services,
  });
});

const updateProvideService = catchAsync(async (req: Request, res: Response) => {
  const { serviceId } = req.params;
  const updatedService = await provideServiceServices.updateProvideServiceInDB(
    serviceId,
    req.body
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Provide service updated successfully",
    data: updatedService,
  });
});

const deleteProvideService = catchAsync(async (req: Request, res: Response) => {
  const { serviceId } = req.params;
  await provideServiceServices.deleteProvideServiceInDB(serviceId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Provide service deleted successfully",
  });
});

export const provideServiceController = {
  createProvideService,
  getSingleProvideService,
  getProvideServices,
  updateProvideService,
  deleteProvideService,
};
