import { DataTypes } from "sequelize";
import sequelize from "../db/index.js";

const Producer = sequelize.define("producer", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: {
        args: [2, 40],
        msg: "Producer must be between 2 and 40 characters",
      },
    },
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [2, 255],
        msg: "Description must be between 2 and 255 characters",
      },
    },
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isUrl: true,
    },
  },
});

export default Producer;
