import { DataTypes } from "sequelize";
import sequelize from "../db/index.js";

const Technique = sequelize.define("technique", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
    validate: {
      len: {
        args: [2, 40],
        msg: "Technique name must be between 2 and 40 characters",
      },
    },
    // defaultValue: "Technique Name",
  },
  image: {
    type: DataTypes.STRING(500),
    allowNull: false,
    validate: {
      isUrl: {
        msg: "Invalid URL format",
      },
    },
  },
  // defaultValue: "https://placehold.co/400",
});

export default Technique;
