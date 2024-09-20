import { Router } from "express";
import { getOrders, createOrder, getOrderById, updateOrder, deleteOrder, getUserOrders } from "../controllers/orders.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import validate from "../middleware/validate.js";
import orderSchema from "../schemas/orders.js";
import verifyTokenMiddleware from "../middleware/verifyToken.js";

const orderRouter = Router();

orderRouter
  .route("/")
  .get(verifyTokenMiddleware, asyncHandler(getOrders))
  .post(verifyTokenMiddleware, validate(orderSchema), asyncHandler(createOrder));

orderRouter.route("/user").get(verifyTokenMiddleware, asyncHandler(getUserOrders));

orderRouter
  .route("/:id")
  .get(verifyTokenMiddleware, asyncHandler(getOrderById))
  .put(verifyTokenMiddleware, validate(orderSchema), asyncHandler(updateOrder))
  .delete(verifyTokenMiddleware, asyncHandler(deleteOrder));

export default orderRouter;
