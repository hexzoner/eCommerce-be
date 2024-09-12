import { Router } from "express";
import { getCategories, createCategory, getCategoryById, updateCategory, deleteCategory } from "../controllers/categories.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import validate from "../middleware/validate.js";
import categorySchema from "../schemas/categories.js";
import authorize from "../middleware/authorize.js";
import verifyTokenMiddleware from "../middleware/verifyToken.js";

const categoryRouter = Router();

categoryRouter
  .route("/")
  .get(asyncHandler(getCategories))
  .post(verifyTokenMiddleware, authorize(["admin"]), validate(categorySchema), asyncHandler(createCategory));
categoryRouter
  .route("/:id")
  .get(asyncHandler(getCategoryById))
  .put(verifyTokenMiddleware, authorize(["admin"]), validate(categorySchema), asyncHandler(updateCategory))
  .delete(verifyTokenMiddleware, authorize(["admin"]), asyncHandler(deleteCategory));

export default categoryRouter;
