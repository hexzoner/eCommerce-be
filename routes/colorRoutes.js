import { Router } from "express";
import { getColors, createColor, getColorById, updateColor, deleteColor } from "../controllers/colors.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import validate from "../middleware/validate.js";
import categorySchema from "../schemas/categories.js";
import authorize from "../middleware/authorize.js";
import verifyTokenMiddleware from "../middleware/verifyToken.js";

const colorRouter = Router();

colorRouter
  .route("/")
  .get(asyncHandler(getColors))
  .post(verifyTokenMiddleware, authorize(["admin"]), validate(categorySchema), asyncHandler(createColor));
colorRouter
  .route("/:id")
  .get(asyncHandler(getColorById))
  .put(verifyTokenMiddleware, authorize(["admin"]), validate(categorySchema), asyncHandler(updateColor))
  .delete(verifyTokenMiddleware, authorize(["admin"]), asyncHandler(deleteColor));

export default colorRouter;
