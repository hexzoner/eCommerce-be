import { User } from "../db/associations.js";
import { ErrorResponse } from "../utils/ErrorResponse.js";

export const getUsers = async (req, res) => {
  const users = await User.findAll();
  const results = users.map((user) => {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      address: user.address,
      email: user.email,
    };
  });

  res.json(results);
};

// To be deleted
export const createUser = async (req, res) => {
  const email = req.body.email;
  const found = await User.findOne({ where: { email } });
  if (found) throw new ErrorResponse("User Already Exist", 409);
  const user = await User.create(req.body);
  res.json({ id: user.id, name: user.name, email: user.email });
};

// To be deleted
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

  const userId = req.userId;
  const userToUpdate = await User.findByPk(id);
  if (!userToUpdate) throw new ErrorResponse("User not found", 404);
  if (userId != id) throw new ErrorResponse("Unauthorized", 401);

  await userToUpdate.update(req.body);

  res.json({ id: userToUpdate.id, firstName: userToUpdate.firstName, lastName: userToUpdate.lastName, email: userToUpdate.email });
};

export const deleteUser = async (req, res) => {
  const {
    params: { id },
  } = req;

  const userId = req.userId;
  const userToDelete = await User.findByPk(id);
  if (!userToDelete) throw new ErrorResponse("User not found", 404);
  if (userId != id) throw new ErrorResponse("Unauthorized", 401);

  await userToDelete.destroy();
  res.json({ message: "User " + id + " deleted successfully" });
};
