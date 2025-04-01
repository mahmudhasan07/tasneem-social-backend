import express from "express";
import { paymentController } from "./payment.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { blockPostmanRequests } from "../../middlewares/postman";

const router = express.Router();

router.post(
  "/create/:orderId",
  // blockPostmanRequests,
  auth(),
  paymentController.checkoutSession
);
router.get(
  "/retrive-payment/:sessionId",
  // blockPostmanRequests,
  auth(),
  paymentController.reteriveSessionById
);
router.get(
  "/",
  // blockPostmanRequests,
  auth(UserRole.ADMIN),
  paymentController.getTransactions
);
router.get(
  "/total-earnings",
  // blockPostmanRequests,
  auth(UserRole.ADMIN),
  paymentController.totalEarnings
);
router.get(
  "/today-earnings",
  // blockPostmanRequests,
  auth(UserRole.ADMIN),
  paymentController.todaysEarning
);

//for admin
router.get(
  "/single-transaction/:id",
  auth(UserRole.ADMIN),
  paymentController.getSingleTransaction
);

//for logged in user
router.get(
  "/logged-user-transactions",
  auth(),
  paymentController.getTransactionForLoggedUser
);

//for logged in user
router.get(
  "/transaction/:id",
  auth(),
  paymentController.getTransaction
);

router.get(
  "/check-payment-status/:orderId",
  paymentController.checkPaymentStatus
);

router.put(
  "/order-status/:paymentId",
  auth(UserRole.ADMIN),
  paymentController.updateOrderStatus
);

export const paymentRoutes = router;
