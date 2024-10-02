// import { json } from "sequelize";
import { Product, User, Category, Color } from "../db/associations.js";
import { CartProduct } from "../models/orderProduct.js";
import { ErrorResponse } from "../utils/ErrorResponse.js";

async function getCart(userId) {
  return await User.findByPk(userId, {
    include: {
      model: Product,
      through: {
        model: CartProduct,
        attributes: [],
      },
      include: [
        { model: Category, attributes: ["name"] },
        { model: Color, attributes: ["name"] },
      ],
    },
  });
}

export const getUserCart = async (req, res) => {
  const userId = req.userId;
  const userCart = await getCart(userId);
  if (!userCart) throw new ErrorResponse("User not found", 404);
  res.json(userCart);
};

export const updateCart = async (req, res) => {
  const userId = req.userId;
  const { productId, quantity } = req.body;
  const userCart = await getCart(userId);
  if (!userCart) throw new ErrorResponse("User not found", 404);

  const product = await Product.findByPk(productId);
  if (!product) throw new ErrorResponse("Product not found", 404);
};
