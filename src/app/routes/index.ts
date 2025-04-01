import express from "express";
import { userRoutes } from "../modules/user/user.route";
import { authRoute } from "../modules/auth/auth.routes";
import { categoryRoutes } from "../modules/category/category.routes";
import { demobookRotes } from "../modules/demobook/demobook.routes";
import { contactRoutes } from "../modules/contact/contact.route";
import { provideServiceRoutes } from "../modules/provideService/provideService.route";
import { serviceRoutes } from "../modules/service/service.route";
import { paymentRoutes } from "../modules/payment/payment.routes";
import { reviewRoutes } from "../modules/review/review.routes";
import { portfolioRoute } from "../modules/portfolioService/portfolio.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/users",
    route: userRoutes,
  },

  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/category",
    route: categoryRoutes,
  },
  {
    path: "/demobook",
    route: demobookRotes,
  },
  {
    path: "/contact",
    route: contactRoutes,
  },
  {
    path: "/provide-service",
    route: provideServiceRoutes,
  },
  {
    path: "/service",
    route: serviceRoutes,
  },
  {
    path: "/portfolio",
    route: portfolioRoute,
  },
  {
    path: "/payment",
    route: paymentRoutes,
  },
  {
    path: "/review",
    route: reviewRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
