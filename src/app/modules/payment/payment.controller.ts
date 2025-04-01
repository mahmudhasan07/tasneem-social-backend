import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { paymentService } from "./payment.service";
import sendResponse from "../../../shared/sendResponse";

const checkoutSession = catchAsync(async (req: any, res: Response) => {
  const userId = req.user.id;
  const { orderId } = req.params;
  const productData = req.body;

  const session = await paymentService.createCheckoutSession(
    productData,
    orderId,
    userId
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Checkout session created",
    data: session,
  });
});

const getTransactions = catchAsync(async (req: Request, res: Response) => {
  const transactions = await paymentService.getTransactions(req);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "transactions retrieved successfully",
    data: transactions,
  });
});

//for admin
const getSingleTransaction = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const transaction = await paymentService.getSingleTransactionFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Transaction details retrived",
    data: transaction,
  });
});

// for logged in user
const getTransactionForLoggedUser = catchAsync(
  async (req: any, res: Response) => {
    const userId = req.user.id;
    const transaction = await paymentService.getTransactionForLoggedUserFromDB(
      userId
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Transaction details retrived",
      data: transaction,
    });
  }
);

//for logged in user
const getTransaction = catchAsync(async (req: any, res: Response) => {
  const userId = req.user.id;
  const { id } = req.params;
  const transaction = await paymentService.getTransactionFromDB(id, userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Transaction details retrived",
    data: transaction,
  });
});

const reteriveSessionById = catchAsync(async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const session = await paymentService.retrivePaymentInfoBySessionIdFromStripe(
    sessionId
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment session retrieved",
    data: session,
  });
});

const totalEarnings = catchAsync(async (req: Request, res: Response) => {
  const total = await paymentService.totalEarnings();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Total earnings retrieved",
    data: total,
  });
});

const todaysEarning = catchAsync(async (req: Request, res: Response) => {
  const total = await paymentService.todaysEarnings();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Today earnings retrieved",
    data: total,
  });
});

const checkPaymentStatus = catchAsync(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const status = await paymentService.checkPaymentStatus(orderId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment status checked",
    data: status,
  });
});

const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const { paymentId } = req.params;
  const { status } = req.body;
  const result = await paymentService.updateOrderStatusInDB(paymentId, status);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Order status updated successfully",
    data: result,
  });
});

export const paymentController = {
  checkoutSession,
  reteriveSessionById,
  totalEarnings,
  todaysEarning,
  checkPaymentStatus,
  getTransactions,
  getSingleTransaction,
  getTransactionForLoggedUser,
  getTransaction,
  updateOrderStatus,
};
