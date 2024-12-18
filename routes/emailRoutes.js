import { Router } from "express";

import { asyncHandler } from "../middleware/errorHandler.js";
import { sendEmail, verificationEmail } from "../controllers/email.js";
// import authorize from "../middleware/authorize.js";
// import verifyTokenMiddleware from "../middleware/verifyToken.js";

const emailRouter = Router();

emailRouter.route("/").post(asyncHandler(sendEmail));

emailRouter.route("/verification").post(asyncHandler(verificationEmail));

export default emailRouter;
