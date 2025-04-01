import { DemoBook } from "@prisma/client";
import { bookRequestBody } from "../../../shared/bookRequest";
import { demobookSearch } from "../../../shared/demobookSearch";
import emailSender from "../../../shared/emailSender";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";
import { contactEmailSender } from "../contact/contact.emailSend";

const createDemoBookInDB = async (payload: any) => {
  const result = await prisma.demoBook.create({
    data: payload,
  });

  await contactEmailSender.emailSender(result.email, bookRequestBody(result));

  return result;
};

const getDemoBook = async (bookedId: string) => {
  const book = await prisma.demoBook.findUnique({ where: { id: bookedId } });
  if (!book) {
    throw new ApiError(404, "Book not found");
  }

  return book;
};

const getDemoBooks = async (req: any) => {
  const { page = 1, limit, search } = req.query;
  const searchFilters = search ? demobookSearch(search) : {};
  const shouldPaginate = page && limit;
  const skip = shouldPaginate
    ? (parseInt(page) - 1) * parseInt(limit)
    : undefined;
  const take = shouldPaginate ? parseInt(limit) : undefined;
  const result = await prisma.demoBook.findMany({
    orderBy: { createdAt: "desc" },
    where: searchFilters,
    skip,
    take,
  });

  const totalCount = await prisma.demoBook.count({ where: searchFilters });

  return {
    totalCount,
    totalPages: shouldPaginate ? Math.ceil(totalCount / parseInt(limit)) : 1,
    currentPage: shouldPaginate ? parseInt(page) : 1,
    demoBooks: result,
  };
};

const responseDemoBooked = async (bookedId: string, response: any) => {
  const result = await prisma.demoBook.findUnique({
    where: { id: bookedId },
  });
  if (!result) {
    throw new ApiError(404, "Booked Record not found");
  }

  await prisma.demoBook.update({
    where: { id: bookedId },
    data: {
      bookedStatus: response.status,
    },
  });

  const htmlBody = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h1 style="color: #4CAF50; text-align: center;">
      ${response.message || `Your demo book request has been updated`}
    </h1>
    <p style="text-align: center;">
      ${
        response.message
          ? ""
          : `The current status of your request is: <strong>${response.status}</strong>`
      }
    </p>
    <p style="text-align: center;">
      Thank you for choosing our service. If you have any questions, feel free to contact us.
    </p>
    <footer style="margin-top: 20px; text-align: center; font-size: 0.9em; color: #555;">
      <p>Best regards,</p>
      <p>RAAYA Social</p>
    </footer>
  </div>`;

  await emailSender(
    `Booked request update for ${result?.reasonOfCall}`,
    result.email,
    htmlBody
  );

  return;
};

const demobookDeleteInDB = async (bookedId: string) => {
  const existingBook = await getDemoBook(bookedId);
  if (!existingBook) {
    throw new ApiError(404, "Book not found");
  }
  await prisma.demoBook.delete({ where: { id: bookedId } });

  return;
};

export const demoBookServices = {
  createDemoBookInDB,
  getDemoBook,
  getDemoBooks,
  demobookDeleteInDB,
  responseDemoBooked,
};
