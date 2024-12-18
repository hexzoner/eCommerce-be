import User from "../models/user.js";
import ErrorResponse from "../middleware/ErrorResponse.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const tokenExpireTime = "7d";

function getUserResponse(user) {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
  };
}

export const login = async (req, res) => {
  const {
    body: { email, password },
  } = req;

  const found = await User.findOne({ where: { email } });
  if (!found) throw new ErrorResponse("Email not found", 401);
  // if (!found) res.json({ status: "error", message: "Email not found" });

  const passwordMatch = await bcrypt.compare(password, found.password);
  if (!passwordMatch) throw new ErrorResponse("Wrong password", 401);
  // if (!passwordMatch) res.json({ status: "error", message: "Wrong password" });

  const token = jwt.sign({ userId: found.id, userEmail: email, userRole: found.role }, process.env.JWT_SECRET, {
    expiresIn: tokenExpireTime,
  });

  res.json({
    user: getUserResponse(found),
    token,
    status: "success",
  });
};

export async function signup(req, res) {
  const {
    body: { email, password, firstName, lastName, role },
  } = req;

  const found = await User.findOne({ where: { email } });
  if (found) throw new ErrorResponse("Email already exist", 409);

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ firstName, lastName, email, password: hashedPassword, role });
  const token = jwt.sign({ userId: user.id, userEmail: email, userRole: user.role }, process.env.JWT_SECRET, {
    expiresIn: tokenExpireTime,
  });

  res.json({ user: { id: user.id, firstName, lastName, email, role }, token });
}

export async function me(req, res) {
  const userId = req.userId;
  const user = await User.findByPk(userId);
  if (!user) throw new ErrorResponse("User doesnt exist", 404);
  res.json(getUserResponse(user));
}

export async function refresh(req, res) {
  res.json({ status: "success" });
}
