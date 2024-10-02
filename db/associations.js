import sequelize from "./index.js";

import User from "../models/user.js";
import Order from "../models/order.js";
import Product from "../models/product.js";
import Category from "../models/category.js";
import Cart from "../models/Cart.js";
import Color from "../models/Color.js";
import { OrderProduct, CartProduct } from "../models/orderProduct.js";
import Wishlist from "../models/wishlist.js";
import Size from "../models/Size.js";
import { ProductSize, ProductColor } from "../models/productProps.js";

User.hasMany(Order, { foreignKey: { name: "userId", allowNull: false } });
Order.belongsTo(User, { foreignKey: { name: "userId", allowNull: false } });

User.hasOne(Cart, { foreignKey: { name: "userId", allowNull: false } });
Cart.belongsTo(User, { foreignKey: { name: "userId", allowNull: false } });

Category.hasMany(Product, { foreignKey: { name: "categoryId", allowNull: false } });
Product.belongsTo(Category, { foreignKey: { name: "categoryId", allowNull: false } });

Order.belongsToMany(Product, { through: OrderProduct });
Product.belongsToMany(Order, { through: OrderProduct });

Cart.belongsToMany(Product, { through: CartProduct });
Product.belongsToMany(Cart, { through: CartProduct });

User.belongsToMany(Product, { through: Wishlist });
Product.belongsToMany(User, { through: Wishlist });

Product.belongsToMany(Color, { through: ProductColor });
Color.belongsToMany(Product, { through: ProductColor });
Product.belongsTo(Color, { as: "defaultColor", foreignKey: "defaultColorId" });
Color.hasMany(Product, { as: "defaultForProducts", foreignKey: "defaultColorId" });

Product.belongsToMany(Size, { through: ProductSize });
Size.belongsToMany(Product, { through: ProductSize });
Product.belongsTo(Size, { as: "defaultSize", foreignKey: "defaultSizeId" });
Size.hasMany(Product, { as: "defaultForProducts", foreignKey: "defaultSizeId" });

sequelize.sync({ alter: true });

export { User, Order, Product, Category, Color, OrderProduct, ProductSize, Size, Wishlist };
