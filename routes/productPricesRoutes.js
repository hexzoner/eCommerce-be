import { Router } from "express";
import { getProductPricesById } from "../controllers/productPrices.js";

const productPricesRouter = Router();

productPricesRouter.route("/:id").get(getProductPricesById);

export default productPricesRouter;
