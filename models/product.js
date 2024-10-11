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
    type: DataTypes.STRING(1500),
    allowNull: false,
    unique: false,
    defaultValue: "No description available",
    validate: {
      len: {
        args: [1, 1500],
        msg: "Product description must be between 1 and 1500 characters",
      },
    },
  },
  details: {
    type: DataTypes.STRING(2000),
    allowNull: true,
    unique: false,
    defaultValue: "No details available",
    validate: {
      len: {
        args: [1, 2000],
        msg: "Product details must be between 1 and 2000 characters",
      },
    },
  },
  notes: {
    type: DataTypes.STRING(2000),
    allowNull: true,
    unique: false,
    defaultValue: "No notes available",
    validate: {
      len: {
        args: [1, 2000],
        msg: "Product notes must be between 1 and 2000 characters",
      },
    },
  },
  instructions: {
    type: DataTypes.STRING(2000),
    allowNull: true,
    unique: false,
    defaultValue: "No instructions available",
    validate: {
      len: {
        args: [1, 2000],
        msg: "Product instructions must be between 1 and 2000 characters",
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
