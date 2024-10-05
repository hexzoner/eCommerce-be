// import { json } from "sequelize";
import { Product, User, Category, Color, Size } from "../db/associations.js";
import { CartProduct } from "../db/associations.js";
import { ErrorResponse } from "../utils/ErrorResponse.js";
import sequelize from "../db/index.js";

async function getCart(userId) {
  console.log("----Getting cart for user:", userId);
  return await CartProduct.findAll({
    where: { userId },
    attributes: ["quantity"], // Include quantity, colorId, and sizeId from the join table
    include: [
      {
        model: Product,
        attributes: ["id", "name", "price", "image", "description"], // Product-specific attributes
        // include: [
        //   { model: Color, attributes: ["id", "name"] }, // Include the Color details
        //   { model: Size, attributes: ["id", "name"] }, // Include the Size details
        // ],
      },
      { model: Color, attributes: ["id", "name"] }, // Include the Color details directly from CartProduct
      { model: Size, attributes: ["id", "name"] }, // Include the Size details directly from CartProduct
    ],
  });
}

function cartResponse(userCart) {
  // Calculate the total price
  const totalPrice = userCart.reduce((total, item) => {
    return total + item.product.price * item.quantity;
  }, 0);

  return { products: userCart, total: totalPrice.toFixed(2) };
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

  // Check if the product exists
  const product = await Product.findByPk(productId);
  if (!product) throw new ErrorResponse("Product not found", 404);

  if (quantity < 0) throw new ErrorResponse("Quantity must be at least 0", 400);

  const transaction = await sequelize.transaction();

  try {
    // Log the state of the cartProducts table before the update
    const cartProductsBefore = await CartProduct.findAll({ where: { userId } });
    console.log("Cart products before update:", JSON.stringify(cartProductsBefore, null, 2));

    // Find if this exact combination of productId, colorId, and sizeId exists in the cart
    let cartProduct = await CartProduct.findOne({
      where: {
        userId,
        productId,
        colorId: color,
        sizeId: size,
      },
      transaction,
      lock: true, // Lock the row to prevent race conditions
    });

    console.log("Found cartProduct:", cartProduct);

    if (cartProduct) {
      // If the combination exists, update the quantity
      if (quantity === 0) {
        // Remove the product from the cart if quantity is set to 0
        await cartProduct.destroy({ transaction });
        console.log("Cart product destroyed:", cartProduct);
      } else {
        // Otherwise, update the quantity
        cartProduct.quantity = quantity;
        await CartProduct.update(
          { quantity },
          {
            where: {
              userId,
              productId,
              colorId: color,
              sizeId: size,
            },
            transaction,
          }
        );
        console.log("Cart product updated:", cartProduct);
      }
    } else {
      // If the combination doesn't exist, create a new entry
      if (quantity > 0) {
        const newCartProduct = await CartProduct.create(
          {
            userId,
            productId,
            colorId: color,
            sizeId: size,
            quantity,
          },
          { transaction }
        );
        console.log("New cart product created:", newCartProduct);
      } else {
        throw new ErrorResponse("Quantity must be at least 1", 400);
      }
    }

    await transaction.commit();

    // Log the state of the cartProducts table after the update
    const cartProductsAfter = await CartProduct.findAll({ where: { userId } });
    console.log("Cart products after update:", JSON.stringify(cartProductsAfter, null, 2));

    // Return the updated cart
    const userCart = await getCart(userId);
    res.json(cartResponse(userCart));
  } catch (error) {
    await transaction.rollback();
    console.error("Error updating cart:", error);
    throw error;
  }
};
export const ClearCart = async (req, res) => {
  const userId = req.userId;
  const userCart = await getCart(userId);
  if (!userCart) throw new ErrorResponse("User not found", 404);
  await userCart.setCartProducts([]);
  res.json(cartResponse(await getCart(userId)));
};
