import { Router } from "express";
import { getMaterials, getMaterialById, createMaterial, updateMaterial, deleteMaterial } from "../controllers/materials.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import validate from "../middleware/validate.js";
import materialSchema from "../schemas/materials.js";
import authorize from "../middleware/authorize.js";
import verifyTokenMiddleware from "../middleware/verifyToken.js";

const materialRouter = Router();

materialRouter
  .route("/")
  .get(asyncHandler(getMaterials))
  .post(verifyTokenMiddleware, authorize(["admin"]), validate(materialSchema.POST), asyncHandler(createMaterial));
materialRouter
  .route("/:id")
  .get(asyncHandler(getMaterialById))
  .put(verifyTokenMiddleware, authorize(["admin"]), validate(materialSchema.PUT), asyncHandler(updateMaterial))
  .delete(verifyTokenMiddleware, authorize(["admin"]), asyncHandler(deleteMaterial));

export default materialRouter;
