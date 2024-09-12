import { DataTypes } from "sequelize";
import sequelize from "../db/index.js";

const Product = sequelize.define("product", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
    validate: {
      len: {
        args: [2, 50],
        msg: "Product name must be between 2 and 50 characters",
      },
    },
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
    validate: {
      len: {
        args: [2, 500],
        msg: "Product description must be between 2 and 500 characters",
      },
    },
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    unique: false,
    validate: {
      isFloat: { msg: "Price must be a float number" },
    },
  },
});

export default Product;
