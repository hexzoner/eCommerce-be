import sequelize from "./index.js";

import User from "../models/user.js";
import Order from "../models/order.js";
import Product from "../models/product.js";
import Category from "../models/category.js";
// import Cart from "../models/Cart.js";
import Color from "../models/Color.js";
import { OrderProduct } from "../models/orderProduct.js";
import Wishlist from "../models/wishlist.js";
import Size from "../models/Size.js";
import { ProductSize, ProductColor } from "../models/productProps.js";
import CartProduct from "../models/CartProduct.js";
import Review from "../models/Review.js";
import Producer from "../models/Producer.js";
import Style from "../models/Style.js";
import Shape from "../models/Shape.js";
import Material from "../models/Material.js";
import Technique from "../models/Technique.js";

User.hasMany(Order, { foreignKey: { name: "userId", allowNull: false } });
Order.belongsTo(User, { foreignKey: { name: "userId", allowNull: false } });

// User.hasOne(Cart, { foreignKey: { name: "userId", allowNull: false } });
// Cart.belongsTo(User, { foreignKey: { name: "userId", allowNull: false } });

Category.hasMany(Product, { foreignKey: { name: "categoryId", allowNull: false } });
Product.belongsTo(Category, { foreignKey: { name: "categoryId", allowNull: false } });

Order.belongsToMany(Product, { through: OrderProduct });
Product.belongsToMany(Order, { through: OrderProduct });

//------------------
User.belongsToMany(Product, { through: CartProduct, as: "CartProducts" });
Product.belongsToMany(User, { through: CartProduct, as: "CartProducts" });

// Ensure CartProduct is associated with Color and Size
CartProduct.belongsTo(Product, { foreignKey: "productId" });
CartProduct.belongsTo(Color, { foreignKey: "colorId" });
CartProduct.belongsTo(Size, { foreignKey: "sizeId" });

//------------------
User.belongsToMany(Product, { through: Wishlist, as: "WishlistProducts" });
Product.belongsToMany(User, { through: Wishlist, as: "WishlistProducts" });

Product.belongsToMany(Color, { through: ProductColor });
Color.belongsToMany(Product, { through: ProductColor });
Product.belongsTo(Color, { as: "defaultColor", foreignKey: "defaultColorId" });
Color.hasMany(Product, { as: "defaultForProducts", foreignKey: "defaultColorId" });

Product.belongsToMany(Size, { through: ProductSize });
Size.belongsToMany(Product, { through: ProductSize });
Product.belongsTo(Size, { as: "defaultSize", foreignKey: "defaultSizeId" });
Size.hasMany(Product, { as: "defaultForProducts", foreignKey: "defaultSizeId" });

Review.belongsTo(Product, { foreignKey: "productId" });
Product.hasMany(Review, { foreignKey: "productId" });

Producer.hasMany(Product, { foreignKey: { name: "producerId", allowNull: false } });
Product.belongsTo(Producer, { foreignKey: { name: "producerId", allowNull: false } });

//Taxonomies
Style.hasMany(Product, { foreignKey: { name: "styleId", allowNull: true } });
Product.belongsTo(Style, { foreignKey: { name: "styleId", allowNull: true } });

Shape.hasMany(Product, { foreignKey: { name: "shapeId", allowNull: true } });
Product.belongsTo(Shape, { foreignKey: { name: "shapeId", allowNull: true } });

Material.hasMany(Product, { foreignKey: { name: "materialId", allowNull: true } });
Product.belongsTo(Material, { foreignKey: { name: "materialId", allowNull: true } });

Technique.hasMany(Product, { foreignKey: { name: "techniqueId", allowNull: true } });
Product.belongsTo(Technique, { foreignKey: { name: "techniqueId", allowNull: true } });

sequelize.sync({ alter: true });

export {
  User,
  Order,
  Product,
  Category,
  Color,
  OrderProduct,
  ProductSize,
  Size,
  Wishlist,
  CartProduct,
  Producer,
  Review,
  Style,
  Shape,
  Material,
  Technique,
};
