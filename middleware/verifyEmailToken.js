import jwt from "jsonwebtoken";
import ErrorResponse from "./ErrorResponse.js";

const verifyEmailToken = (req, res, next) => {
  try {
    const { token } = req.query;
    if (!token) throw new ErrorResponse("Token is required", 400);
    // console.log(token);
    const payload = jwt.verify(token, process.env.JWT_VERIFICATION_SECRET);
    if (!payload) throw new ErrorResponse("Invalid token", 400);
    // console.log(payload);
    req.userId = payload.userId;
    req.purpose = payload.purpose;
    next();
  } catch (e) {
    next(e);
  }
};
export default verifyEmailToken;
