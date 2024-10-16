import { Router } from "express";
import { getLatestArrivals, createLatestArrival, updateLatestArrival, deleteLatestArrival } from "../controllers/latestArrivals.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import latestArrivalsSchema from "../schemas/latestArrivals.js";
import authorize from "../middleware/authorize.js";
import verifyTokenMiddleware from "../middleware/verifyToken.js";
import validate from "../middleware/validate.js";

const latestArrivalRouter = Router();

latestArrivalRouter.get("/", asyncHandler(getLatestArrivals));

latestArrivalRouter.post("/", verifyTokenMiddleware, authorize(["admin"]), validate(latestArrivalsSchema.POST), asyncHandler(createLatestArrival));

latestArrivalRouter
  .put("/:id", verifyTokenMiddleware, authorize(["admin"]), validate(latestArrivalsSchema.PUT), asyncHandler(updateLatestArrival))
  .delete("/:id", verifyTokenMiddleware, authorize(["admin"]), asyncHandler(deleteLatestArrival));

export default latestArrivalRouter;
