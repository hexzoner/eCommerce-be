import { DataTypes } from "sequelize";
import sequelize from "../db/index.js";

const Category = sequelize.define("category", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: {
        args: [2, 30],
        msg: "Category must be between 2 and 30 characters",
      },
    },
  },
});

export default Category;
