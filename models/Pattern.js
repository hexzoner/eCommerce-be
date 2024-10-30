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
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
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
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
});

// export const PatternImage = sequelize.define("patternImage", {
//   order: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     defaultValue: 0,
//   },
// });
