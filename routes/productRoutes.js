import { Router } from "express";
import { getProducts, createProduct, getProductById, updateProduct, deleteProduct } from "../controllers/products.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import productSchema from "../schemas/products.js";
import validate from "../middleware/validate.js";
import verifyTokenMiddleware from "../middleware/verifyToken.js";
import authorize from "../middleware/authorize.js";

const productRouter = Router();

productRouter
  .route("/")
  .get(asyncHandler(getProducts))
  .post(verifyTokenMiddleware, authorize(["admin"]), validate(productSchema.POST), asyncHandler(createProduct));
productRouter
  .route("/:id")
  .get(asyncHandler(getProductById))
  .put(verifyTokenMiddleware, authorize(["admin"]), validate(productSchema.PUT), asyncHandler(updateProduct))
  .delete(verifyTokenMiddleware, authorize(["admin"]), asyncHandler(deleteProduct));

export default productRouter;
