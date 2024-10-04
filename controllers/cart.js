// import { json } from "sequelize";
import { col } from "sequelize";
import { Product, User, Category, Color, Size } from "../db/associations.js";
import { CartProduct } from "../models/orderProduct.js";
import { ErrorResponse } from "../utils/ErrorResponse.js";

async function getCart(userId) {
  return await User.findByPk(userId, {
    include: {
      model: Product,
      as: "CartProducts", // Alias the included model
      through: {
        model: CartProduct,
        attributes: ["quantity", "color", "size"], // Include the 'through' table (CartProduct) attributes (quantity, etc.)
      },
      attributes: { exclude: ["categoryId", "defaultColorId", "defaultSizeId"] },
      include: [
        {
          model: Category,
          attributes: ["name", "id"],
        },
        {
          model: Color,
          attributes: ["name", "id"],
          through: { attributes: [] }, // Exclude 'productColor' pivot table data
        },
        {
          model: Size,
          through: { attributes: [] }, // Exclude 'through' attributes for Size
        },
        {
          model: Color,
          as: "defaultColor", // Alias for the default color
          attributes: ["name", "id"], // Include the default color's name and id
        },
        {
          model: Size,
          as: "defaultSize", // Alias for the default size
          attributes: ["name", "id"], // Include the default size's name and id
        },
      ],
    },
  });
}

function cartResponse(userCart) {
  // Calculate the total price
  const totalPrice = userCart.CartProducts.reduce((total, product) => {
    return total + product.price * product.cartProduct.quantity;
  }, 0);
  return { products: userCart.CartProducts, total: totalPrice.toFixed(2) };
}

export const getUserCart = async (req, res) => {
  const userId = req.userId;
  const userCart = await getCart(userId);
  if (!userCart) throw new ErrorResponse("User not found", 404);
  res.json(cartResponse(userCart));
};

export const updateCart = async (req, res) => {
  const userId = req.userId;
  const { productId, quantity, color, size } = req.body;

  const userCart = await getCart(userId);
  if (!userCart) throw new ErrorResponse("User not found", 404);

  const product = await Product.findByPk(productId);
  if (!product) throw new ErrorResponse("Product not found", 404);

  if (quantity < 0) throw new ErrorResponse("Quantity must be at least 0", 400);

  if (!color || !size) throw new ErrorResponse("Quantity, color, and size are required", 400);
  const existingCartProduct = await CartProduct.findOne({
    where: {
      userId,
      productId,
      color: String(color),
      size: String(size),
    },
  });

  if (existingCartProduct) {
    if (quantity === 0) await userCart.removeCartProduct(product);
    else await existingCartProduct.update({ quantity });
  } else {
    await userCart.addCartProduct(product, { through: { quantity, color, size } });
  }

  // Refetch the cart with the updated products
  const updatedCart = await getCart(userId);
  res.json(cartResponse(updatedCart));
};

export const ClearCart = async (req, res) => {
  const userId = req.userId;
  const userCart = await getCart(userId);
  if (!userCart) throw new ErrorResponse("User not found", 404);
  await userCart.setCartProducts([]);
  res.json(cartResponse(await getCart(userId)));
};
