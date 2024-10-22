import { DataTypes } from "sequelize";
import sequelize from "../db/index.js";

const Style = sequelize.define("style", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: {
        args: [2, 40],
        msg: "Style name must be between 2 and 40 characters",
      },
    },
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isUrl: {
        msg: "Invalid URL format",
      },
    },
  },
});

export default Style;
