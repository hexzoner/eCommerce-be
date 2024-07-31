import { Router } from "express";
import { getCategories, createCategory, getCategoryById, updateCategory, deleteCategory } from "../controllers/categories.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import validate from "../middleware/validate.js";
import categorySchema from "../schemas/categories.js";

const categoryRouter = Router();

categoryRouter.route("/").get(asyncHandler(getCategories)).post(validate(categorySchema), asyncHandler(createCategory));
categoryRouter.route("/:id").get(asyncHandler(getCategoryById)).put(validate(categorySchema), asyncHandler(updateCategory)).delete(asyncHandler(deleteCategory));

export default categoryRouter;
