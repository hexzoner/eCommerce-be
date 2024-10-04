import { DataTypes } from "sequelize";
import sequelize from "../db/index.js";

const OrderProduct = sequelize.define("orderProduct", {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: false,
    validate: {
      isInt: { msg: "Quantity must be an integer" },
    },
  },
});

const CartProduct = sequelize.define("cartProduct", {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: false,
    defaultValue: 1,
    validate: {
      isInt: { msg: "Quantity must be an integer" },
    },
  },
  color: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
  },
  size: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
  },
});

export { OrderProduct, CartProduct };
