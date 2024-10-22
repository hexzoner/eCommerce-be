import { DataTypes } from "sequelize";
import sequelize from "../db/index.js";

const Style = sequelize.define("style", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
    validate: {
      len: {
        args: [2, 40],
        msg: "Style name must be between 2 and 40 characters",
      },
    },
    // defaultValue: "Style Name",
  },
  image: {
    type: DataTypes.STRING(500),
    allowNull: false,
    validate: {
      isUrl: {
        msg: "Invalid URL format",
      },
    },
    // defaultValue: "https://placehold.co/400",
  },
});

export default Style;
