// import { json } from "sequelize";
import { Product, Size, Pattern } from "../db/associations.js";
import { CartProduct } from "../db/associations.js";
import { ErrorResponse } from "../utils/ErrorResponse.js";
import { calculateProductsTotal } from "../utils/PriceCalculation.js";
import sequelize from "../db/index.js";

async function getCart(userId) {
  // console.log("----Getting cart for user:", userId);
  return await CartProduct.findAll({
    where: { userId },
    attributes: ["quantity"],
    include: [
      {
        model: Product,
        attributes: ["id", "name", "price", "image", "description"],
      },
      { model: Pattern, attributes: ["id", "name", "icon"] },
      { model: Size, attributes: ["id", "name", "squareMeters"] },
    ],
    order: [
      [Product, "id", "ASC"],
      ["patternId", "ASC"],
      ["sizeId", "ASC"],
    ],
  });
}

export const getUserCart = async (req, res) => {
  const userId = req.userId;
  const userCart = await getCart(userId);
  if (!userCart) throw new ErrorResponse("User not found", 404);
  res.json(calculateProductsTotal(userCart));
};

export const updateCart = async (req, res) => {
  const userId = req.userId;
  const { productId, quantity, pattern, size } = req.body;

  // Check if the product exists
  const product = await Product.findByPk(productId);
  if (!product) throw new ErrorResponse("Product not found", 404);
  // if (quantity < 0) throw new ErrorResponse("Quantity must be at least 0", 400);

  const transaction = await sequelize.transaction();

  try {
    // const cartProductsBefore = await CartProduct.findAll({ where: { userId } });
    // console.log("Cart products before update:", JSON.stringify(cartProductsBefore, null, 2));

    // Find if this exact combination of productId, colorId, and sizeId exists in the cart
    const whereClause = {
      userId,
      productId,
      patternId: pattern,
      sizeId: size,
    };

    let cartProduct = await CartProduct.findOne({
      where: whereClause,
      transaction,
      lock: true, // Lock the row to prevent race conditions
    });

    // console.log("Found cartProduct:", cartProduct);

    if (cartProduct) {
      // If the combination exists, update the quantity
      if (quantity === 0) {
        // Remove the product from the cart if quantity is set to 0
        await CartProduct.destroy({
          where: whereClause,
          transaction,
        });
        // console.log("Cart product destroyed:", cartProduct);
      } else {
        // Otherwise, update the quantity
        const newQuantity = cartProduct.quantity + quantity;
        // cartProduct.quantity += newQuantity;
        await CartProduct.update(
          {
            quantity: newQuantity,
          },
          {
            where: whereClause,
            transaction,
          }
        );
        // console.log("Cart product updated:", cartProduct);
      }
    } else {
      // If the combination doesn't exist, create a new entry
      if (quantity > 0) {
        const newCartProduct = await CartProduct.create({ ...whereClause, quantity }, { transaction });
        // console.log("New cart product created:", newCartProduct);
      } else throw new ErrorResponse("Quantity must be at least 1", 400);
    }

    await transaction.commit();

    // Log the state of the cartProducts table after the update
    // const cartProductsAfter = await CartProduct.findAll({ where: { userId } });
    // console.log("Cart products after update:", JSON.stringify(cartProductsAfter, null, 2));

    // Return the updated cart
    const userCart = await getCart(userId);
    res.json(calculateProductsTotal(userCart));
  } catch (error) {
    await transaction.rollback();
    console.error("Error updating cart:", error);
    throw new ErrorResponse("Error updating cart", 500);
  }
};

// Function to clear the cart for a user
export const clearCart = async (req, res) => {
  const userId = req.userId;
  try {
    await CartProduct.destroy({
      where: { userId },
    });
    res.json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
