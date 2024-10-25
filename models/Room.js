import { DataTypes } from "sequelize";
import sequelize from "../db/index.js";

const Room = sequelize.define("room", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
    validate: {
      len: {
        args: [2, 40],
        msg: "Room name must be between 2 and 40 characters",
      },
    },
    // defaultValue: "Material Name",
  },
  image: {
    type: DataTypes.STRING(500),
    allowNull: false,
    validate: {
      len: {
        args: [1, 500],
        msg: "Image URL must be between 1 and 500 characters",
      },
    },
    // validate: {
    //   isUrl: {
    //     msg: "Invalid URL format",
    //   },
    // },
    // defaultValue: "https://placehold.co/400",
  },
});

export default Room;
