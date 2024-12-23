import { Router } from "express";
import { getProductPatterns, createProductPattern, updateProductPattern, deleteProductPattern, getPatternById } from "../controllers/patterns.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import validate from "../middleware/validate.js";
import authorize from "../middleware/authorize.js";
import verifyTokenMiddleware from "../middleware/verifyToken.js";
import patternSchema from "../schemas/pattern.js";

const productPatternRouter = Router();

productPatternRouter
  .route("/")
  .get(asyncHandler(getPatternById))
  .post(verifyTokenMiddleware, authorize("admin"), validate(patternSchema.POST), asyncHandler(createProductPattern));

productPatternRouter
  .route("/:id")
  .get(asyncHandler(getProductPatterns))
  .put(verifyTokenMiddleware, authorize("admin"), validate(patternSchema.PUT), asyncHandler(updateProductPattern))
  .delete(verifyTokenMiddleware, authorize("admin"), asyncHandler(deleteProductPattern));

export default productPatternRouter;
