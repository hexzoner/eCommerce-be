import { Router } from "express";
import { getRooms, updateRoom, getRoomById, createRoom, deleteRoom } from "../controllers/rooms.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import validate from "../middleware/validate.js";
import taxonomySchema from "../schemas/taxonomySchema.js";
import authorize from "../middleware/authorize.js";
import verifyTokenMiddleware from "../middleware/verifyToken.js";

const roomRouter = Router();

roomRouter
  .route("/")
  .get(asyncHandler(getRooms))
  .post(verifyTokenMiddleware, authorize(["admin"]), validate(taxonomySchema.POST), asyncHandler(createRoom));
roomRouter
  .route("/:id")
  .get(asyncHandler(getRoomById))
  .put(verifyTokenMiddleware, authorize(["admin"]), validate(taxonomySchema.PUT), asyncHandler(updateRoom))
  .delete(verifyTokenMiddleware, authorize(["admin"]), asyncHandler(deleteRoom));

export default roomRouter;
