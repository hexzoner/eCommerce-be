import { DataTypes } from "sequelize";
import sequelize from "../db/index.js";

const Product = sequelize.define("product", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
    validate: {
      len: {
        args: [1, 100],
        msg: "Product name must be between 1 and 100 characters",
      },
    },
  },
  description: {
    type: DataTypes.STRING(1000),
    allowNull: false,
    unique: false,
    validate: {
      len: {
        args: [1, 1000],
        msg: "Product description must be between 1 and 1000 characters",
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
  image: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    unique: false,
    defaultValue: true,
  },
});

export default Product;
