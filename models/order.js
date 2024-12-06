import { DataTypes } from "sequelize";
import sequelize from "../db/index.js";

const Order = sequelize.define("order", {
  total: {
    type: DataTypes.FLOAT,
    allowNull: false,
    unique: false,
    validate: {
      isFloat: { msg: "Total must be a float number" },
    },
    defaultValue: 0,
  },
  stripeSessionId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
});

export default Order;
