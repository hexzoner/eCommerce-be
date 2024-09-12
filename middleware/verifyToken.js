import jwt from "jsonwebtoken";
import ErrorResponse from "./ErrorResponse.js";

const verifyTokenMiddleware = (req, res, next) => {
  try {
    const {
      headers: { authorization },
    } = req;
    if (!authorization) throw new ErrorResponse("Please login to access this resource", 401);
    const authToken = authorization.split(" ")[1];
    const secret = process.env.JWT_SECRET;
    const payload = jwt.verify(authToken, secret); // Get the payload if verification is successful
    if (!payload) throw new ErrorResponse("Invalid token", 400);

    // Create custom properties in request object
    req.userId = payload.userId;
    req.email = payload.email;
    req.role = payload.role;
    next(); // Call next handler
  } catch (e) {
    next(e);
  }
};

export default verifyTokenMiddleware;
