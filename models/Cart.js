import { DataTypes } from "sequelize";
import sequelize from "../db/index.js";

const Cart = sequelize.define("cart", {
  total: {
    type: DataTypes.FLOAT,
    allowNull: false,
    unique: false,
    validate: {
      isFloat: { msg: "Total must be a float number" },
    },
  },
});

export default Cart;
