import { Portfolio } from "@prisma/client";
import { Request } from "express";
import config from "../../../config";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";

const createPortfolioIntoDB = async (req: Request) => {
    const payload = req.body;
  const files = req.file;
//   console.log(payload, files);
  
  const imageUrl = files
    ? `${config.backend_base_url}/uploads/${files.originalname}`
    : null;
  const result = await prisma.portfolio.create({
    data: {
      ...payload,
      image: imageUrl ? imageUrl : "",
    },
  });

  return result;
};

const getAllPortfoliosFromDB = async () => {
  const portfolios = await prisma.portfolio.findMany();
  return portfolios;
};

const getSinglePortfolioFromDB = async (portfolioId: string) => {
  const result = await prisma.portfolio.findUnique({
    where: { id: portfolioId },
  });
  return result;
};

const deletePortfoliosFromDB = async (protfolioId: string) => {
  const findData = await getSinglePortfolioFromDB(protfolioId);
  if (!findData) {
    throw new ApiError(404, "Portfolio not found");
  }

  await prisma.portfolio.delete({ where: { id: protfolioId } });
  return;
};

const updatePortfolioInDB = async (req: Request) => {
  const portfolioId = req.params.id;
  const files = req.file;
  const payload = req.body;
  
  const findData = await getSinglePortfolioFromDB(portfolioId);
  if (!findData) {
    throw new ApiError(404, "Portfolio not found");
  }

  const imageUrl = files
    ? `${config.backend_base_url}/uploads/${files.originalname}`
    : null;

  const result = await prisma.portfolio.update({
    where: { id: portfolioId },
    data: {
      ...payload,
      image: imageUrl ? imageUrl : findData.image,
    },
  });

  return result;
};

export const portfolioService = {
  createPortfolioIntoDB,
  getAllPortfoliosFromDB,
  deletePortfoliosFromDB,
  updatePortfolioInDB,
};
