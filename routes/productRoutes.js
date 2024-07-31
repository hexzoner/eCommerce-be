import { Router } from "express";
import { getProducts, createProduct, getProductById, updateProduct, deleteProduct } from "../controllers/products.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import productSchema from "../schemas/products.js";
import validate from "../middleware/validate.js";

const productRouter = Router();

productRouter.route("/").get(asyncHandler(getProducts)).post(validate(productSchema.POST), asyncHandler(createProduct));
productRouter.route("/:id").get(asyncHandler(getProductById)).put(validate(productSchema.PUT), asyncHandler(updateProduct)).delete(asyncHandler(deleteProduct));

export default productRouter;
