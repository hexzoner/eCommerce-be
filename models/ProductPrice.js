import { DataTypes } from "sequelize";
import sequelize from "../db/index.js";

const ProductPrice = sequelize.define(
  "productPrice",
  {
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false,
      references: {
        model: "products",
        key: "id",
      },
    },
    // patternId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   unique: false,
    //   references: {
    //     model: "patterns",
    //     key: "id",
    //   },
    // },
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
    stripePriceId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
      defaultValue: "",
    },
    stripeProductId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
      defaultValue: "",
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["productId", "sizeId"], // Composite unique constraint
      },
    ],
  }
);

export default ProductPrice;
