import { DataTypes } from "sequelize";
import sequelize from "../db/index.js";

const OrderProduct = sequelize.define(
  "orderProduct",
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
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      unique: false,
      defaultValue: 0,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["orderId", "productId", "patternId", "sizeId"], // Composite unique constraint
      },
    ],
  }
);

export { OrderProduct };
