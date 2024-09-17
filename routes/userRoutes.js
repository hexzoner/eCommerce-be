import { Router } from "express";
import { getUsers, createUser, getUserById, updateUser, deleteUser } from "../controllers/users.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import userSchema from "../schemas/users.js";
import validate from "../middleware/validate.js";
import authorize from "../middleware/authorize.js";
import verifyTokenMiddleware from "../middleware/verifyToken.js";

const userRouter = Router();

userRouter
  .route("/")
  .get(verifyTokenMiddleware, authorize(["admin"]), asyncHandler(getUsers))
  .post(verifyTokenMiddleware, authorize(["admin"]), validate(userSchema.POST), asyncHandler(createUser));
userRouter
  .route("/:id")
  .get(verifyTokenMiddleware, asyncHandler(getUserById))
  .put(verifyTokenMiddleware, validate(userSchema.PUT), asyncHandler(updateUser))
  .delete(verifyTokenMiddleware, asyncHandler(deleteUser));

export default userRouter;
