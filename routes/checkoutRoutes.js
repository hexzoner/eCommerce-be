import { Router } from "express";
import { createCheckout, verifyCheckoutSession } from "../controllers/stripe.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const checkoutRouter = Router();

checkoutRouter.route("/").post(asyncHandler(createCheckout));
checkoutRouter.route("/:sessionId").get(asyncHandler(verifyCheckoutSession));

export default checkoutRouter;
