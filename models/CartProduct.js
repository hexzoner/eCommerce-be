import { DataTypes } from "sequelize";
import sequelize from "../db/index.js";

const CartProduct = sequelize.define(
  "cartProduct",
  {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false,
      defaultValue: 1,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false,
      references: {
        model: "products",
        key: "id",
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    patternId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false,
      references: {
        model: "patterns",
        key: "id",
      },
    },
    sizeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false,
      references: {
        model: "sizes",
        key: "id",
      },
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["userId", "productId", "patternId", "sizeId"], // Composite unique constraint
      },
    ],
  }
);

export default CartProduct;
