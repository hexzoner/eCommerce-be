import { Router } from "express";
import { getShapes, getShapeById, createShape, updateShape, deleteShape } from "../controllers/shapes.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import validate from "../middleware/validate.js";
import shapesSchema from "../schemas/shapes.js";
import authorize from "../middleware/authorize.js";
import verifyTokenMiddleware from "../middleware/verifyToken.js";

const shapeRouter = Router();

shapeRouter
  .route("/")
  .get(asyncHandler(getShapes))
  .post(verifyTokenMiddleware, authorize(["admin"]), validate(shapesSchema.POST), asyncHandler(createShape));
shapeRouter
  .route("/:id")
  .get(asyncHandler(getShapeById))
  .put(verifyTokenMiddleware, authorize(["admin"]), validate(shapesSchema.PUT), asyncHandler(updateShape))
  .delete(verifyTokenMiddleware, authorize(["admin"]), asyncHandler(deleteShape));

export default shapeRouter;
