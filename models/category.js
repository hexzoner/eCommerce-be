import { DataTypes } from "sequelize";
import sequelize from "../db/index.js";

const Category = sequelize.define("category", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: {
        args: [2, 40],
        msg: "Category must be between 2 and 40 characters",
      },
    },
  },
  image: {
    type: DataTypes.STRING(500),
    allowNull: true,
    validate: {
      len: {
        args: [1, 500],
        msg: "Image URL must be between 1 and 500 characters",
      },
    },
  },
});

export default Category;
