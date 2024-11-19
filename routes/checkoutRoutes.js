import { Router } from "express";
import { createCheckout } from "../controllers/stripe.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const checkoutRouter = Router();

checkoutRouter.route("/").post(asyncHandler(createCheckout));
