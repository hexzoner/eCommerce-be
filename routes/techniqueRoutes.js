import { Router } from "express";
import { getTechniques, getTechniqueById, createTechnique, updateTechnique, deleteTechnique } from "../controllers/technique.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import validate from "../middleware/validate.js";
import techniqueSchema from "../schemas/techniques.js";
import authorize from "../middleware/authorize.js";
import verifyTokenMiddleware from "../middleware/verifyToken.js";

const materialRouter = Router();

materialRouter
  .route("/")
  .get(asyncHandler(getTechniques))
  .post(verifyTokenMiddleware, authorize(["admin"]), validate(techniqueSchema.POST), asyncHandler(createTechnique));
materialRouter
  .route("/:id")
  .get(asyncHandler(getTechniqueById))
  .put(verifyTokenMiddleware, authorize(["admin"]), validate(techniqueSchema.PUT), asyncHandler(updateTechnique))
  .delete(verifyTokenMiddleware, authorize(["admin"]), asyncHandler(deleteTechnique));

export default materialRouter;
