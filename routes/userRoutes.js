import { Router } from "express";
import { getUsers, createUser, getUserById, updateUser, deleteUser } from "../controllers/users.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import userSchema from "../schemas/users.js";
import validate from "../middleware/validate.js";

const userRouter = Router();

userRouter.route("/").get(asyncHandler(getUsers)).post(validate(userSchema.POST), asyncHandler(createUser));
userRouter.route("/:id").get(asyncHandler(getUserById)).put(validate(userSchema.PUT), asyncHandler(updateUser)).delete(asyncHandler(deleteUser));

export default userRouter;
