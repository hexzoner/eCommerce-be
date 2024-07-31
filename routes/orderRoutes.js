import { Router } from "express";
import { getOrders, createOrder, getOrderById, updateOrder, deleteOrder } from "../controllers/orders.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import validate from "../middleware/validate.js";
import orderSchema from "../schemas/orders.js";

const orderRouter = Router();

orderRouter.route("/").get(asyncHandler(getOrders)).post(validate(orderSchema), asyncHandler(createOrder));
orderRouter.route("/:id").get(asyncHandler(getOrderById)).put(validate(orderSchema), asyncHandler(updateOrder)).delete(asyncHandler(deleteOrder));

export default orderRouter;
