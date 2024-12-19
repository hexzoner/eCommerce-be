import { DataTypes } from "sequelize";
import sequelize from "../db/index.js";

const User = sequelize.define("user", {
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
    defaultValue: "user",
    validate: {
      isIn: {
        args: [["user", "admin"]],
        msg: "Role must be either 'user' or 'admin'",
      },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
    validate: {
      len: {
        args: [2, 100],
        msg: "Password must be between 2 and 100 characters",
      },
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: { msg: "Email must be a valid email address" },
      len: {
        args: [2, 50],
        msg: "Email must be between 2 and 50 characters",
      },
    },
  },
  verified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    unique: false,
    defaultValue: false,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
    validate: {
      len: {
        args: [0, 30],
        msg: "First name must be between 0 and 30 characters",
      },
    },
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
    validate: {
      len: {
        args: [0, 30],
        msg: "Last name must be between 0 and 30 characters",
      },
    },
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
    validate: {
      len: {
        args: [0, 30],
        msg: "Address must be between 0 and 30 characters",
      },
    },
  },
  cartTotal: {
    type: DataTypes.FLOAT,
    allowNull: false,
    unique: false,
    defaultValue: 0,
    validate: {
      isFloat: { msg: "Cart total must be a float number" },
    },
  },
});

export default User;
