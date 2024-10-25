import { Router } from "express";
import { getMaterials, getMaterialById, createMaterial, updateMaterial, deleteMaterial } from "../controllers/materials.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import validate from "../middleware/validate.js";
import taxonomySchema from "../schemas/taxonomySchema.js";
import authorize from "../middleware/authorize.js";
import verifyTokenMiddleware from "../middleware/verifyToken.js";

const materialRouter = Router();

materialRouter
  .route("/")
  .get(asyncHandler(getMaterials))
  .post(verifyTokenMiddleware, authorize(["admin"]), validate(taxonomySchema.POST), asyncHandler(createMaterial));
materialRouter
  .route("/:id")
  .get(asyncHandler(getMaterialById))
  .put(verifyTokenMiddleware, authorize(["admin"]), validate(taxonomySchema.PUT), asyncHandler(updateMaterial))
  .delete(verifyTokenMiddleware, authorize(["admin"]), asyncHandler(deleteMaterial));

export default materialRouter;
