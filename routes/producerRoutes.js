import { Router } from "express";
import { getProducers, createProducer, getProducerById, updateProducer, deleteProducer } from "../controllers/producers.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import validate from "../middleware/validate.js";
import authorize from "../middleware/authorize.js";
import producerSchema from "../schemas/producers.js";
import verifyTokenMiddleware from "../middleware/verifyToken.js";

const producerRouter = Router();

producerRouter
  .route("/")
  .get(asyncHandler(getProducers))
  .post(verifyTokenMiddleware, authorize("admin"), validate(producerSchema.POST), asyncHandler(createProducer));

producerRouter
  .route("/:id")
  .get(asyncHandler(getProducerById))
  .put(verifyTokenMiddleware, authorize("admin"), validate(producerSchema.PUT), asyncHandler(updateProducer))
  .delete(verifyTokenMiddleware, authorize("admin"), asyncHandler(deleteProducer));

export default producerRouter;
