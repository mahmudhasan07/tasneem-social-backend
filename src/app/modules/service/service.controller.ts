import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { serviceServices } from "./service.service";

const createService = catchAsync(async (req: Request, res: Response) => {
  const service = await serviceServices.createServiceInDB(req);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "service created successfully",
    data: service,
  });
});

const getSingleService = catchAsync(async (req: Request, res: Response) => {
  const { serviceId } = req.params;
  const service = await serviceServices.getSingleServiceFromDB(serviceId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Provide service retrived successfully",
    data: service,
  });
});

const getServices = catchAsync(async (req: Request, res: Response) => {
  const services = await serviceServices.getServicesFromDB(req);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "get all services returned successfully",
    data: services,
  });
});

const likeUnlike = catchAsync(async (req: any, res: Response) => {
  const { serviceId } = req.params;
  const { id } = req.user;
  const result = await serviceServices.likeUnlikeInDB(serviceId, id);

  const existingLike = result.likedIds.find((id) => id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `${existingLike === id ? "Liked" : "Unliked"} successfully`,
    data: result,
  });
});

const commentCreate = catchAsync(async (req: any, res: Response) => {
  const { serviceId } = req.params;
  const { id } = req.user;
  const { comment } = req.body;
  const result = await serviceServices.commnetInService(comment, serviceId, id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Comment this service successfully",
    data: result,
  });
});

const updateService = catchAsync(async (req: Request, res: Response) => {
  const { serviceId } = req.params;
  const result = await serviceServices.updateServiceInDB(serviceId, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "service updated successfully",
    data: result,
  });
});

const deleteService = catchAsync(async (req: Request, res: Response) => {
  const { serviceId } = req.params;
  await serviceServices.deleteServiceInDB(serviceId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Service deleted successfully",
  });
});

export const serviceController = {
  createService,
  getSingleService,
  getServices,
  likeUnlike,
  commentCreate,
  updateService,
  deleteService,
};
