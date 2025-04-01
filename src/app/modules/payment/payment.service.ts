import Stripe from "stripe";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import config from "../../../config";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";
import { paymentSearchFilter } from "../../../shared/paymentSearchFilter";
import emailSender from "../../../shared/emailSender";
import { OrderStatus } from "@prisma/client";

const stripe = new Stripe(config.stripe_key as string);

const createCheckoutSession = async (
  productData: any,
  orderId: string,
  userId: string
) => {
  const info = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: productData.items,
    mode: "payment",
    success_url: config.stripe_payment_success_url,
    cancel_url: config.stripe_payment_cancel_url,
    metadata: {
      orderId: orderId,
      userId: userId,
      service: productData.service,
      time: productData.time,
    },
  });

  console.log(info);

  return info;
};

const retrivePaymentInfoBySessionIdFromStripe = async (sessionId: string) => {
  const session: any = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items"],
  });

  const info = {
    paymentId: session.id,
    orderId: session.metadata.orderId,
    userId: session.metadata.userId,
    totalAmount: session.amount_total,
    currency: session.currency,
    customerDetails: session.customer_details,
    paymentMethod: session.payment_method_types[0],
    paymentStatus: session.payment_status,
    mode: session.mode,
    service: session.metadata.service,
    time: session.metadata.time,
  };

  if (session.payment_status === "paid") {
    const isExistingInfo: any = await prisma.payment.findUnique({
      where: {
        paymentId: sessionId,
      },
    });

    if (isExistingInfo?.paymentId === sessionId) {
      return info;
    }

    const paymentInfo = await prisma.payment.create({
      data: info,
    });

    const pdfBuffer = await createPDF(isExistingInfo || paymentInfo);

    await emailSender(
      `Payment Successful For ${session.line_items.data[0].description}`,
      session.customer_details.email,
      `<div style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f9f9f9; padding: 20px; border-radius: 10px; max-width: 600px; margin: 0 auto;">
    <table width="100%" style="border-collapse: collapse;">
      <tr>
        <td style="background-color: #007BFF; color: #fff; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h2 style="margin: 0; font-size: 24px;">Payment Successful</h2>
        </td>
      </tr>
      <tr>
        <td style="padding: 20px; background-color: #ffffff; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; margin: 0;">Dear <strong>${
            session.customer_details.name
          }</strong>,</p>
          <p style="font-size: 16px; margin-top: 10px;">Your payment has been successfully completed for the <strong>${
            session.line_items.data[0].description
          }</strong></p>
          <p style="font-size: 16px; margin-top: 10px;">Please ignore this email or contact support if you have any concerns.</p>
          <p style="font-size: 16px; margin-top: 20px;">Thank you,<br>RAAYA SOCIAL</p>
        </td>
      </tr>
      <tr>
        <td style="background-color: #f5f5f5; padding: 10px; text-align: center; font-size: 12px; color: #888; border-radius: 0 0 10px 10px;">
          <p style="margin: 0;">&copy; ${new Date().getFullYear()} RAAYA SOCIAL. All rights reserved.</p>
        </td>
      </tr>
    </table>
  </div>`,
      [
        {
          filename: `Payment_Confirmation_${session.line_items.data[0].description}.pdf`,
          content: Buffer.from(pdfBuffer),
          contentType: "application/pdf",
        },
      ]
    );

    return paymentInfo;
  }
};

//get transactions only admin
const getTransactions = async (req: any) => {
  const transactions = await prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      order: true,
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          mobile: true,
        },
      },
    },
  });

  return transactions;
};

//get transaction only admin
const getSingleTransactionFromDB = async (paymentId: string) => {
  const transaction = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      order: true,
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          mobile: true,
        },
      },
    },
  });

  if (!transaction) {
    throw new ApiError(404, "Payment not found");
  }

  return transaction;
};

//get order list only logged in users
const getTransactionForLoggedUserFromDB = async (userId: string) => {
  const transactions = await prisma.payment.findMany({
    where: { userId: userId },
    include: { order: true },
  });

  if (transactions.length === 0) {
    throw new ApiError(404, "No payments found for this user");
  }

  return transactions;
};

//get order only logged in user
const getTransactionFromDB = async (paymentId: string, userId: string) => {
  const transaction = await prisma.payment.findUnique({
    where: { id: paymentId, userId: userId },
    include: { order: true },
  });

  if (!transaction) {
    throw new ApiError(404, "Payment not found");
  }

  return transaction;
};

const createPDF = async (info: any) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 size in points (width, height)

  // Draw a black border around the page
  const borderWidth = 2;
  page.drawRectangle({
    x: 0,
    y: 0,
    width: 595.28, // Width of A4 in points
    height: 841.89, // Height of A4 in points
    borderColor: rgb(0, 0, 0),
    borderWidth: borderWidth,
    opacity: 1,
  });

  const invoiceHeading = "PAYMENT INVOICE";
  const invoiceTextSize = 24;
  const invoiceTextWidth = invoiceHeading.length * (invoiceTextSize * 0.6);
  page.drawText(invoiceHeading, {
    x: (595.28 - invoiceTextWidth) / 2,
    y: 770,
    size: invoiceTextSize,
  });

  // Add company info at the top
  const companyName = "GP Clinic Team";
  page.drawText(companyName, {
    x: 50,
    y: 730,
    size: 20,
  });

  // Draw the main heading
  page.drawText(
    `Payment Confirmation for "${info.productName}" Certificate Request`,
    {
      x: 50,
      y: 700,
      size: 15,
    }
  );

  page.drawText(`Payment ID: ${info.id}`, {
    x: 50,
    y: 680,
    size: 13,
  });

  page.drawText(`Order ID: ${info.orderId}`, {
    x: 50,
    y: 663,
    size: 13,
  });

  const formattedDate = new Intl.DateTimeFormat("en-GB").format(info.date);

  page.drawText(`Date: ${formattedDate}`, {
    x: 50,
    y: 646,
    size: 13,
  });

  // Add User Info Heading
  const userInfoHeading = "User Information";
  const userInfoHeadingY = 610; // Position for User Info Heading
  page.drawText(userInfoHeading, {
    x: 50,
    y: userInfoHeadingY,
    size: 16,
    font: await pdfDoc.embedFont(StandardFonts.Helvetica), // Use a bold font for the heading
  });

  // Add User Info (Name, Email, Phone)
  page.drawText(`Name: ${info.customerDetails.name}`, {
    x: 50,
    y: userInfoHeadingY - 20,
    size: 12,
  });

  page.drawText(`Email: ${info.customerDetails.email}`, {
    x: 50,
    y: userInfoHeadingY - 40,
    size: 12,
  });

  if (info.customerDetails.phone) {
    page.drawText(`Phone: ${info.customerDetails.phone}`, {
      x: 50,
      y: userInfoHeadingY - 55,
      size: 12,
    });
  }

  // Define table headers
  const headers = ["Field", "Details"];
  const headerY = userInfoHeadingY - 80; // Adjust position for table header
  const rowHeight = 20;

  // Draw table headers
  page.drawText(headers[0], { x: 50, y: headerY, size: 16 });
  page.drawText(headers[1], { x: 300, y: headerY, size: 16 });

  // Draw horizontal line below header
  page.drawRectangle({
    x: 45,
    y: headerY - 5,
    width: 510,
    height: 2,
    color: rgb(0, 0, 0),
  });

  // Fill in the table rows with payment info
  const rows = [
    { label: "Payment Method", value: info.paymentMethod },
    { label: "Payment Status", value: info.paymentStatus },
    { label: "Mode", value: info.mode },
    {
      label: "Total Amount",
      value: `${(info.totalAmount / 100).toFixed(
        2
      )} ${info.currency.toUpperCase()}`,
    },
  ];

  let currentY = headerY - 25; // Start drawing rows below the header
  for (const row of rows) {
    page.drawText(row.label, { x: 50, y: currentY, size: 14 });
    page.drawText(row.value, { x: 300, y: currentY, size: 14 });
    currentY -= rowHeight; // Move down for the next row
  }

  // Draw a horizontal line at the end of the table
  page.drawRectangle({
    x: 45,
    y: currentY + 5,
    width: 510,
    height: 2,
    color: rgb(0, 0, 0), // Black color for the line
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};

const totalEarnings = async (): Promise<string> => {
  let total = 0;
  let hasMore = true;
  let lastId: string | undefined;

  while (hasMore) {
    const paymentIntents = await stripe.paymentIntents.list({
      limit: 100,
      starting_after: lastId,
    });

    total += paymentIntents.data
      .filter((intent) => intent.status === "succeeded")
      .reduce((sum, intent) => sum + intent.amount, 0);

    hasMore = paymentIntents.has_more;
    if (hasMore)
      lastId = paymentIntents.data[paymentIntents.data.length - 1].id;
  }

  const totalInDollars = (total / 100).toFixed(2);
  return totalInDollars;
};

const todaysEarnings = async (): Promise<string> => {
  let total = 0;
  let hasMore = true;
  let lastId: string | undefined;

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();

  const startTimestamp = Math.floor(startOfDay.getTime() / 1000);
  const endTimestamp = Math.floor(endOfDay.getTime() / 1000);

  while (hasMore) {
    const paymentIntents = await stripe.paymentIntents.list({
      limit: 100,
      starting_after: lastId,
      created: {
        gte: startTimestamp,
        lte: endTimestamp,
      },
    });

    total += paymentIntents.data
      .filter((intent) => intent.status === "succeeded")
      .reduce((sum, intent) => sum + intent.amount, 0);

    hasMore = paymentIntents.has_more;
    if (hasMore) {
      lastId = paymentIntents.data[paymentIntents.data.length - 1].id;
    }
  }

  const totalInDollars = (total / 100).toFixed(2);
  return totalInDollars;
};

const checkPaymentStatus = async (orderId: string) => {
  const status = await prisma.payment.findFirst({
    where: { orderId: orderId },
    select: {
      id: true,
      orderId: true,
      paymentStatus: true,
      totalAmount: true,
    },
  });

  if (!status) {
    return "unpaid";
  }

  return {
    ...status,
    totalAmount: status.totalAmount / 100,
  };
};

const updateOrderStatusInDB = async (
  paymentId: string,
  status: OrderStatus
) => {
  const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
  if (!payment) {
    throw new ApiError(404, "Order not found");
  }
  const result = await prisma.payment.update({
    where: { id: paymentId },
    data: { orderStatus: status },
  });

  return result;
};

export const paymentService = {
  createCheckoutSession,
  retrivePaymentInfoBySessionIdFromStripe,
  totalEarnings,
  todaysEarnings,
  checkPaymentStatus,
  getTransactions,
  getSingleTransactionFromDB,
  getTransactionForLoggedUserFromDB,
  getTransactionFromDB,
  updateOrderStatusInDB,
};
