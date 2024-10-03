import { Router } from "express";
import { getUserCart, updateCart, ClearCart } from "../controllers/cart.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import validate from "../middleware/validate.js";
import authorize from "../middleware/authorize.js";
import verifyTokenMiddleware from "../middleware/verifyToken.js";

const cartRouter = Router();

cartRouter
  .route("/")
  .get(verifyTokenMiddleware, authorize(["user"]), asyncHandler(getUserCart))
  .post(verifyTokenMiddleware, authorize(["user"]), asyncHandler(updateCart))
  .delete(verifyTokenMiddleware, authorize(["user"]), asyncHandler(ClearCart));

export default cartRouter;
