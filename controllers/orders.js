// import { json } from "sequelize";
import { Order, Product, User, Pattern, Size, OrderProduct, ProductSize } from "../db/associations.js";
import { ErrorResponse } from "../utils/ErrorResponse.js";
import { calculateProductsTotal } from "./cart.js";
import sequelize from "../db/index.js";
import { format } from "sequelize/lib/utils";

const orderOptions = {
  attributes: ["orderId", "quantity"],
  include: [
    {
      model: Product,
      attributes: ["id", "name", "price", "image", "description"],
    },
    { model: Pattern, attributes: ["id", "name", "icon"] },
    { model: Size, attributes: ["id", "name"] },
    {
      model: Order,
      attributes: ["total", "createdAt", "updatedAt"],
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName", "email"],
        },
      ],
    },
  ],
  order: [
    ["orderId", "DESC"],
    [Product, "id", "ASC"],
    ["patternId", "ASC"],
    ["sizeId", "ASC"],
  ],
};

export const getUserOrders = async (req, res) => {
  const userId = req.userId;
  const orders = await Order.findAll({ ...orderOptions, where: { userId } });

  res.json(orders);
};

function formatUser(user) {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  };
}

function formatProduct(product) {
  return {
    productId: product.productId,
    quantity: product.quantity,
    name: product.product.name,
    price: product.product.price,
  };
}

export const getOrders = async (req, res) => {
  const orders = await OrderProduct.findAll(orderOptions);

  const formattedOrders = [];

  // Group the products by order
  for (const o of orders) {
    const order = formattedOrders.find((order) => order.id === o.orderId);
    if (order) {
      // Add the product to the existing order
      order.products.push(formatProduct(o));
    } else {
      // Create a new order in the formattedOrders array
      formattedOrders.push({
        id: o.orderId,
        user: formatUser(o.order.user),
        products: [formatProduct(o)],
        total: o.order.total,
        createdAt: o.order.createdAt,
        updatedAt: o.order.updatedAt,
      });
    }
  }
  res.json(formattedOrders);
};

export const createOrder = async (req, res) => {
  const { userId, products } = req.body;

  const transaction = await sequelize.transaction(); // Start a transaction

  try {
    const userExists = await User.findByPk(userId, { transaction });
    if (!userExists) throw new ErrorResponse("User not found", 404);

    const uniqueProductIds = [...new Set(products.map((product) => product.productId))];
    const productsExist = await Product.findAll({ where: { id: uniqueProductIds }, attributes: ["id"], transaction });
    if (productsExist.length !== uniqueProductIds.length) throw new ErrorResponse("Some products not exist", 404);

    for (const p of products) {
      //check if the pattern exists and belongs to the product
      const pattern = await Pattern.findByPk(p.patternId, { transaction });
      if (!pattern) throw new ErrorResponse("Pattern not found", 404);
      if (pattern.productId !== p.productId) throw new ErrorResponse(`Pattern ${p.patternId} does not belong to the product ${p.productId}`, 400);

      //check if the size exists and belongs to the product
      const size = await Size.findByPk(p.sizeId, { transaction });
      if (!size) throw new ErrorResponse("Size not found", 404);
      const productSize = await ProductSize.findOne({ where: { productId: p.productId, sizeId: p.sizeId }, transaction });
      if (!productSize) throw new ErrorResponse("Size does not belong to the product", 400);
    }

    // Create the order
    const order = await Order.create(req.body, { transaction });
    console.log(order);
    if (!order) throw new ErrorResponse("Failed to create order", 500);

    const orderProducts = products.map((product) => {
      return {
        orderId: order.id,
        productId: product.productId,
        patternId: product.patternId,
        sizeId: product.sizeId,
        quantity: product.quantity,
      };
    });
    // Create the order products
    await OrderProduct.bulkCreate(orderProducts, { transaction });
    // Get the created order with products
    const createdOrder = await OrderProduct.findAll({ ...orderOptions, where: { orderId: order.id }, transaction });
    const orderWithTotal = calculateProductsTotal(createdOrder);
    // Update the order total
    await order.update({ total: orderWithTotal.total }, { transaction });
    await transaction.commit(); // Commit transaction if all is well
    res.status(201).json(orderWithTotal);
  } catch (error) {
    await transaction.rollback(); // Rollback transaction on any error
    // Check if the error is an instance of ErrorResponse and send custom details
    if (error instanceof ErrorResponse) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    // For unexpected errors, send a generic message and log the actual error
    console.error("Unexpected error:", error); // Log the actual error for debugging
    return res.status(500).json({ message: "Failed to create order" });
  }
};

export const getOrderById = async (req, res) => {
  const id = req.params.id;
  const order = await Order.findByPk(id, {
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName", "email"],
      },
    ],
  });
  if (!order) throw new ErrorResponse("Order not found", 404);
  const orderProducts = await OrderProduct.findAll({ ...orderOptions, where: { orderId: id } });

  const formattedOrder = {
    id: order.id,
    user: formatUser(order.user),
    products: orderProducts.map((o) => {
      return formatProduct(o);
    }),
    total: order.total,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };

  res.json(formattedOrder);
};

export const updateOrder = async (req, res) => {
  const id = req.params.id;
  const products = req.body.products;
  const order = await Order.findByPk(id);
  if (!order) throw new ErrorResponse("Order not found", 404);
  order.update(req.body);

  // Remove existing products in the order
  await OrderProduct.destroy({ where: { orderId: id } });

  const orderProducts = products.map((product) => {
    return {
      orderId: order.id,
      productId: product.productId,
      quantity: product.quantity,
    };
  });
  await OrderProduct.bulkCreate(orderProducts);

  res.json({ order, products });
};

export const deleteOrder = async (req, res) => {
  const id = req.params.id;
  const order = await Order.findByPk(id);
  if (!order) throw new ErrorResponse("Order not found", 404);
  await order.destroy();
  res.json("Order " + id + " deleted successfully");
};
