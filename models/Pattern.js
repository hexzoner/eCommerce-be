import { DataTypes } from "sequelize";
import sequelize from "../db/index.js";

export const Pattern = sequelize.define("pattern", {
  name: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
    validate: {
      len: [1, 255],
    },
  },
  icon: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
    validate: {
      len: [1, 255],
      isUrl: {
        msg: "Invalid URL format",
      },
    },
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
});

export const Image = sequelize.define("image", {
  imageURL: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
    validate: {
      len: [1, 255],
      isUrl: {
        msg: "Invalid URL format",
      },
    },
  },
});

export const PatternImage = sequelize.define("patternImage", {});
