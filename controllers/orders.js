// import { json } from "sequelize";
import { Order, Product, User } from "../db/associations.js";
import { OrderProduct } from "../models/orderProduct.js";
import { ErrorResponse } from "../utils/ErrorResponse.js";

export const getUserOrders = async (req, res) => {
  const userId = req.userId;
  const orders = await Order.findAll({
    where: { userId },
    include: [
      {
        model: Product,
      },
      {
        model: User,
        attributes: ["id", "firstName", "lastName", "email"],
      },
    ],
  });

  res.json(orders);
};

export const getOrders = async (req, res) => {
  const orders = await Order.findAll({
    include: [
      {
        model: Product,
      },
      {
        model: User,
        attributes: ["id", "firstName", "lastName", "email"],
      },
    ],
  });

  const result = orders.map((order) => {
    return {
      id: order.id,
      userId: order.userId,
      user: {
        id: order.user.id,
        firstName: order.user.firstName,
        lastName: order.user.lastName,
        email: order.user.email,
      },
      products: order.products.map((product) => {
        return {
          productId: product.orderProduct.productId,
          quantity: product.orderProduct.quantity,
          name: product.name,
          price: product.price,
        };
      }),
      total: order.total,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  });

  res.json(result);
};

export const createOrder = async (req, res) => {
  const products = req.body.products;
  const order = await Order.create(req.body);
  const orderProducts = products.map((product) => {
    return {
      orderId: order.id,
      productId: product.productId,
      quantity: product.quantity,
    };
  });
  await OrderProduct.bulkCreate(orderProducts);

  res.status(201).json({
    id: order.id,
    userId: order.userId,
    products: orderProducts.map((product) => {
      return {
        productId: product.productId,
        quantity: product.quantity,
      };
    }),
    total: order.total,
  });
};

export const getOrderById = async (req, res) => {
  const id = req.params.id;
  const order = await Order.findByPk(id, { include: Product });
  if (!order) throw new ErrorResponse("Order not found", 404);

  const response = {
    id: order.id,
    userId: order.userId,
    products: order.products.map((product) => {
      return {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: product.orderProduct.quantity,
      };
    }),
    total: order.total,
  };
  res.json(response);
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
