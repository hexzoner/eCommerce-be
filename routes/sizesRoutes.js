import { Router } from "express";
import { getSizes, getSizeById, createSize, updateSize, deleteSize } from "../controllers/sizes.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import validate from "../middleware/validate.js";
import sizeSchema from "../schemas/sizes.js";
import authorize from "../middleware/authorize.js";
import verifyTokenMiddleware from "../middleware/verifyToken.js";

const sizeRouter = Router();

sizeRouter
  .route("/")
  .get(asyncHandler(getSizes))
  .post(verifyTokenMiddleware, authorize(["admin"]), validate(sizeSchema), asyncHandler(createSize));
sizeRouter
  .route("/:id")
  .get(asyncHandler(getSizeById))
  .put(verifyTokenMiddleware, authorize(["admin"]), validate(sizeSchema), asyncHandler(updateSize))
  .delete(verifyTokenMiddleware, authorize(["admin"]), asyncHandler(deleteSize));

export default sizeRouter;
