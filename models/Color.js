import { DataTypes } from "sequelize";
import sequelize from "../db/index.js";

const Color = sequelize.define("color", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: {
        args: [2, 40],
        msg: "Color must be between 2 and 40 characters",
      },
    },
  },
});

export default Color;