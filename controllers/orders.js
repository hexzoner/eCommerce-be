import { Order, Product, User, Pattern, Size, OrderProduct, ProductSize, CartProduct } from "../db/associations.js";
import { ErrorResponse } from "../utils/ErrorResponse.js";
import { calculateProductsTotal, calculatePriceForProduct } from "../utils/PriceCalculation.js";
import sequelize from "../db/index.js";

const orderProductAttributes = ["orderId", "quantity", "price"];

const orderOptions = {
  attributes: orderProductAttributes,
  include: [
    {
      model: Product,
      attributes: ["id", "name", "price", "image", "description", "samplePrice"],
    },
    { model: Pattern, attributes: ["id", "name", "icon"] },
    { model: Size, attributes: ["id", "name", "squareMeters"] },
    {
      model: Order,
      attributes: ["total", "createdAt", "updatedAt", "stripeSessionId"],
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

function formatUser(user) {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  };
}

function formatProduct(order) {
  return {
    id: order.product.id,
    quantity: order.quantity,
    name: order.product.name,
    price: order.price,
    pattern: {
      id: order.pattern.id,
      name: order.pattern.name,
      icon: order.pattern.icon,
    },
    size: {
      id: order.size.id,
      name: order.size.name,
    },
  };
}

function formatOrders(orders) {
  const result = [];
  for (const o of orders) {
    const order = result.find((order) => order.id === o.orderId);
    if (order) {
      // Add the product to the existing order
      order.products.push(formatProduct(o));
    } else {
      // Create a new order in the formattedOrders array
      result.push({
        id: o.orderId,
        stripeSessionId: o.order.stripeSessionId,
        user: formatUser(o.order.user),
        products: [formatProduct(o)],
        total: o.order.total,
        createdAt: o.order.createdAt,
        updatedAt: o.order.updatedAt,
      });
    }
  }

  return result;
}

export const getOrders = async (req, res) => {
  const {
    query: { page, perPage },
  } = req;

  // Get total unique orders and calculate the offset
  const totalOrders = await Order.count();
  const offset = page ? (page - 1) * perPage : 0;
  const limit = perPage ? perPage : 20;

  // Get order IDs for the current page
  const orderIds = await Order.findAll({
    // where: { userId },
    attributes: ["id"],
    order: [["id", "DESC"]],
    offset,
    limit,
  });
  const orderIdList = orderIds.map((order) => order.id);

  const orders = await OrderProduct.findAll({
    where: {
      orderId: orderIdList, // Only fetch OrderProduct entries for current page orderIds
    },
    attributes: orderProductAttributes,
    include: [
      {
        model: Product,
        attributes: ["id", "name", "price", "image", "description", "samplePrice"],
      },
      { model: Pattern, attributes: ["id", "name", "icon"] },
      { model: Size, attributes: ["id", "name"] },
      {
        model: Order,
        attributes: ["total", "createdAt", "updatedAt", "stripeSessionId"],
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
  });

  res.json({
    results: formatOrders(orders),
    total: totalOrders,
    page: page ? parseInt(page) : 1,
    totalPages: Math.ceil(totalOrders / limit),
  });
};

export const getUserOrders = async (req, res) => {
  const userId = req.userId;
  const {
    query: { page, perPage },
  } = req;

  const totalOrders = await Order.count({ where: { userId } });
  const offset = page ? (page - 1) * perPage : 0;
  const limit = perPage ? perPage : 20;

  const orderIds = await Order.findAll({
    where: { userId },
    attributes: ["id"],
    order: [["id", "DESC"]],
    offset,
    limit,
  });
  const orderIdList = orderIds.map((order) => order.id);

  const orders = await OrderProduct.findAll({
    where: {
      orderId: orderIdList, // Only fetch OrderProduct entries for current page orderIds
    },
    attributes: orderProductAttributes,
    include: [
      {
        model: Product,
        attributes: ["id", "name", "price", "image", "description", "samplePrice"],
      },
      { model: Pattern, attributes: ["id", "name", "icon"] },
      { model: Size, attributes: ["id", "name"] },
      {
        model: Order,
        where: { userId },
        attributes: ["total", "createdAt", "updatedAt", "stripeSessionId"],
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
  });
  res.json({
    results: formatOrders(orders),
    total: totalOrders,
    page: page ? parseInt(page) : 1,
    totalPages: Math.ceil(totalOrders / limit),
  });
};

export const createOrder = async (req, res) => {
  const { products, stripeSessionId } = req.body;
  const userId = req.userId;

  const orderWithStripeIdAlreadyExists = await Order.findOne({ where: { stripeSessionId } });
  if (orderWithStripeIdAlreadyExists) {
    res.status(201).json({ status: 400, message: "Order with this stripe session id already exists" });
    return;
  }

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
    const order = await Order.create(
      {
        ...req.body,
        userId,
      },
      { transaction }
    );

    if (!order) throw new ErrorResponse("Failed to create order", 500);

    const orderProducts = await Promise.all(
      products.map(async (product) => {
        const size = await Size.findByPk(product.sizeId, { transaction });
        const productFromDB = await Product.findByPk(product.productId, { transaction });
        return {
          orderId: order.id,
          productId: product.productId,
          patternId: product.patternId,
          sizeId: product.sizeId,
          quantity: product.quantity,
          price: calculatePriceForProduct(productFromDB, size),
        };
      })
    );
    // Create the order products
    await OrderProduct.bulkCreate(orderProducts, { transaction });
    // Get the created order with products
    const createdOrder = await OrderProduct.findAll({ ...orderOptions, where: { orderId: order.id }, transaction });
    if (!createdOrder) throw new ErrorResponse("Failed to create order", 500);
    const orderWithTotal = calculateProductsTotal(createdOrder);
    // Update the order total
    await order.update({ total: orderWithTotal.total }, { transaction });
    // Clear user cart
    await CartProduct.destroy({ where: { userId }, transaction });
    await transaction.commit(); // Commit transaction if all is well
    createdOrder[0].order.total = orderWithTotal.total;
    res.status(201).json(formatOrders(createdOrder));
  } catch (error) {
    await transaction.rollback(); // Rollback transaction on any error
    orderErrorHandler(error, res);
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

  res.json(formatOrders(orderProducts));
};

export const updateOrder = async (req, res) => {
  const {
    body: { products },
    params: { id },
  } = req;

  const userId = req.userId;

  const transaction = await sequelize.transaction(); // Start a transaction

  try {
    const user = await User.findByPk(userId, { transaction });
    if (!user) throw new ErrorResponse("User not found", 404);

    const order = await Order.findByPk(id, { transaction });
    if (!order) throw new ErrorResponse("Order not found", 404);

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

    // Remove existing products in the order
    await OrderProduct.destroy({ where: { orderId: id }, transaction });

    const orderProducts = products.map((product) => {
      return {
        orderId: id,
        productId: product.productId,
        patternId: product.patternId,
        sizeId: product.sizeId,
        quantity: product.quantity,
      };
    });

    // Create the order products
    await OrderProduct.bulkCreate(orderProducts, { transaction });
    // Get the created order with products
    const createdOrder = await OrderProduct.findAll({ ...orderOptions, where: { orderId: id }, transaction });
    if (!createdOrder) throw new ErrorResponse("Failed to update order", 500);
    const orderWithTotal = calculateProductsTotal(createdOrder);
    // Update the order total
    await order.update({ total: orderWithTotal.total }, { transaction });
    await transaction.commit(); // Commit transaction if all is well
    createdOrder[0].order.total = orderWithTotal.total;
    res.json(formatOrders(createdOrder));
  } catch (error) {
    await transaction.rollback(); // Rollback transaction on any error
    orderErrorHandler(error, res);
  }
};

export const deleteOrder = async (req, res) => {
  const id = req.params.id;

  const transaction = await sequelize.transaction(); // Start a transaction

  try {
    const order = await Order.findByPk(id, { transaction });
    if (!order) throw new ErrorResponse("Order not found", 404);

    await OrderProduct.destroy({ where: { orderId: id }, transaction });
    await order.destroy({ transaction });
    await transaction.commit(); // Commit transaction if all is well
    res.json({ message: "Order " + id + " deleted successfully" });
  } catch (error) {
    await transaction.rollback(); // Rollback transaction on any error
    orderErrorHandler(error, res);
  }
};

function orderErrorHandler(error, res) {
  if (error instanceof ErrorResponse) {
    return res.status(error.statusCode).json({ message: error.message });
  }
  console.error("Unexpected error:", error); // Log the actual error for debugging
  return res.status(500).json({ message: "Failed to create order" });
}
