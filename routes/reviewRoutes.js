import { Router } from "express";
import validate from "../middleware/validate.js";
// import authorize from "../middleware/authorize.js";
import verifyTokenMiddleware from "../middleware/verifyToken.js";
import reviewSchema from "../schemas/review.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { getReviews, createReview, updateReview, deleteReview, getReviewById } from "../controllers/reviews.js";

const reviewRouter = Router();

reviewRouter.route("/").get(asyncHandler(getReviews)).post(verifyTokenMiddleware, validate(reviewSchema.POST), asyncHandler(createReview));

reviewRouter
  .route("/:id")
  .get(asyncHandler(getReviewById))
  .put(verifyTokenMiddleware, validate(reviewSchema.PUT), asyncHandler(updateReview))
  .delete(verifyTokenMiddleware, asyncHandler(deleteReview));

export default reviewRouter;
