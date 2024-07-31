import { DataTypes } from "sequelize";
import sequelize from "../db/index.js";

const User = sequelize.define("user", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
    validate: {
      len: {
        args: [2, 30],
        msg: "Name must be between 2 and 30 characters",
      },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
    validate: {
      len: {
        args: [4, 30],
        msg: "Password must be between 4 and 30 characters",
      },
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: { msg: "Email must be a valid email address" },
    },
  },
});

export default User;
