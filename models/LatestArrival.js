import { DataTypes } from "sequelize";
import sequelize from "../db/index.js";

const LatestArrival = sequelize.define("latestArrival", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: {
        args: [2, 40],
        msg: "Name must be between 2 and 40 characters",
      },
    },
  },
  image: {
    type: DataTypes.STRING(500),
    allowNull: false,
    validate: {
      isUrl: true,
    },
  },
  link: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default LatestArrival;
