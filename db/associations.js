import sequelize from "./index.js";

import User from "../models/user.js";
import Order from "../models/order.js";
import Product from "../models/product.js";
import Category from "../models/category.js";
import Color from "../models/Color.js";
import OrderProduct from "../models/orderProduct.js";

User.hasMany(Order, { foreignKey: { name: "userId", allowNull: false } });
Order.belongsTo(User, { foreignKey: { name: "userId", allowNull: false } });

Category.hasMany(Product, { foreignKey: { name: "categoryId", allowNull: false } });
Product.belongsTo(Category, { foreignKey: { name: "categoryId", allowNull: false } });

Color.hasMany(Product, { foreignKey: { name: "colorId", allowNull: false } });
Product.belongsTo(Color, { foreignKey: { name: "colorId", allowNull: false } });

Order.belongsToMany(Product, { through: OrderProduct });
Product.belongsToMany(Order, { through: OrderProduct });

sequelize.sync({ alter: true });

export { User, Order, Product, Category, Color, OrderProduct };
