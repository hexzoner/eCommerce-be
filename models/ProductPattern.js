import { DataTypes } from "sequelize";
import sequelize from "../db/index.js";

export const ProductPattern = sequelize.define("productPattern", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
    validate: {
      len: [1, 255],
    },
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
    validate: {
      len: [1, 255],
    },
  },
});
