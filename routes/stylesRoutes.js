import { Router } from "express";
import { getStyles, getStyleById, updateStyle, createStyle, deleteStyle } from "../controllers/styles.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import validate from "../middleware/validate.js";
import taxonomySchema from "../schemas/taxonomySchema.js";
import authorize from "../middleware/authorize.js";
import verifyTokenMiddleware from "../middleware/verifyToken.js";

const styleRouter = Router();

styleRouter
  .route("/")
  .get(asyncHandler(getStyles))
  .post(verifyTokenMiddleware, authorize(["admin"]), validate(taxonomySchema.POST), asyncHandler(createStyle));
styleRouter
  .route("/:id")
  .get(asyncHandler(getStyleById))
  .put(verifyTokenMiddleware, authorize(["admin"]), validate(taxonomySchema.PUT), asyncHandler(updateStyle))
  .delete(verifyTokenMiddleware, authorize(["admin"]), asyncHandler(deleteStyle));

export default styleRouter;
