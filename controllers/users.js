import { User } from "../db/associations.js";
import { ErrorResponse } from "../utils/ErrorResponse.js";

export const getUsers = async (req, res) => {
  const users = await User.findAll();

  const results = users.map((user) => {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  });

  res.json(results);
};

export const createUser = async (req, res) => {
  const email = req.body.email;

  const found = await User.findOne({ where: { email } });
  if (found) throw new ErrorResponse("User Already Exist", 409);

  const user = await User.create(req.body);

  res.json({ id: user.id, name: user.name, email: user.email });
};

export const getUserById = async (req, res) => {
  const {
    params: { id },
  } = req;

  const user = await User.findByPk(id);
  if (!user) throw new ErrorResponse("User not found", 404);

  res.json({ id: user.id, name: user.name, email: user.email });
};

export const updateUser = async (req, res) => {
  const {
    params: { id },
  } = req;

  const user = await User.findByPk(id);
  if (!user) throw new ErrorResponse("User not found", 404);

  await user.update(req.body);

  res.json({ id: user.id, name: user.name, email: user.email });
};

export const deleteUser = async (req, res) => {
  const {
    params: { id },
  } = req;

  const user = await User.findByPk(id);
  if (!user) throw new ErrorResponse("User not found", 404);

  await user.destroy();

  res.json({ message: "User " + id + " deleted successfully" });
};
