import { Router } from "express";

import { asyncHandler } from "../middleware/errorHandler.js";
import { sendEmail, verificationEmail, emailConfirmation } from "../controllers/email.js";
// import authorize from "../middleware/authorize.js";
// import verifyTokenMiddleware from "../middleware/verifyToken.js";
import verifyEmailToken from "../middleware/verifyEmailToken.js";

const emailRouter = Router();

emailRouter.route("/").post(asyncHandler(sendEmail));

emailRouter.route("/verification").post(asyncHandler(verificationEmail));

emailRouter.route("/confirm").get(verifyEmailToken, asyncHandler(emailConfirmation));

export default emailRouter;
