import { Router } from "express";
import { GetWishlist, AddToWishlist, RemoveFromWishlist } from "../controllers/wishlist.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import authorize from "../middleware/authorize.js";
import verifyTokenMiddleware from "../middleware/verifyToken.js";

const wishlistRouter = Router();

wishlistRouter
  .route("/")
  .get(verifyTokenMiddleware, authorize(["user"]), asyncHandler(GetWishlist))
  .post(verifyTokenMiddleware, authorize(["user"]), asyncHandler(AddToWishlist))
  .delete(verifyTokenMiddleware, authorize(["user"]), asyncHandler(RemoveFromWishlist));

export default wishlistRouter;
