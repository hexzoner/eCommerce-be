import { Router } from "express";
import { getFeatures, getFeatureById, createFeature, updateFeature, deleteFeature } from "../controllers/features.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import validate from "../middleware/validate.js";
import taxonomySchema from "../schemas/taxonomySchema.js";
import authorize from "../middleware/authorize.js";
import verifyTokenMiddleware from "../middleware/verifyToken.js";

const featureRouter = Router();

featureRouter
  .route("/")
  .get(asyncHandler(getFeatures))
  .post(verifyTokenMiddleware, authorize(["admin"]), validate(taxonomySchema.POST), asyncHandler(createFeature));
featureRouter
  .route("/:id")
  .get(asyncHandler(getFeatureById))
  .put(verifyTokenMiddleware, authorize(["admin"]), validate(taxonomySchema.PUT), asyncHandler(updateFeature))
  .delete(verifyTokenMiddleware, authorize(["admin"]), asyncHandler(deleteFeature));

export default featureRouter;
