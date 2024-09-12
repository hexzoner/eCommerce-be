import { Router } from "express";
import { login, signup, me } from "../controllers/auth.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import verifyTokenMiddleware from "../middleware/verifyToken.js";

const authRouter = Router();

authRouter.route("/login").post(asyncHandler(login)).post(asyncHandler(login));
authRouter.route("/signup").post(asyncHandler(signup)).post(asyncHandler(signup));
authRouter.route("/me").get(verifyTokenMiddleware, asyncHandler(me)).post(verifyTokenMiddleware, asyncHandler(me));

export default authRouter;
