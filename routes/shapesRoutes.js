import { Router } from "express";
import { getShapes, getShapeById, createShape, updateShape, deleteShape } from "../controllers/shapes.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import validate from "../middleware/validate.js";
import taxonomySchema from "../schemas/taxonomySchema.js";
import authorize from "../middleware/authorize.js";
import verifyTokenMiddleware from "../middleware/verifyToken.js";

const shapeRouter = Router();

shapeRouter
  .route("/")
  .get(asyncHandler(getShapes))
  .post(verifyTokenMiddleware, authorize(["admin"]), validate(taxonomySchema.POST), asyncHandler(createShape));
shapeRouter
  .route("/:id")
  .get(asyncHandler(getShapeById))
  .put(verifyTokenMiddleware, authorize(["admin"]), validate(taxonomySchema.PUT), asyncHandler(updateShape))
  .delete(verifyTokenMiddleware, authorize(["admin"]), asyncHandler(deleteShape));

export default shapeRouter;
