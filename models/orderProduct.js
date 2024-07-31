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

export default OrderProduct;
