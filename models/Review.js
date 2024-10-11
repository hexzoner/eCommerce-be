import { DataTypes } from "sequelize";
import sequelize from "../db/index.js";

const Review = sequelize.define("review", {
  author: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [1, 100],
        msg: "Author name must be between 1 and 100 characters",
      },
    },
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: {
        args: 1,
        msg: "Rating must be at least 1",
      },
      max: {
        args: 5,
        msg: "Rating must be at most 5",
      },
    },
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [1, 100],
        msg: "Title must be between 1 and 100 characters",
      },
    },
  },
  review: {
    type: DataTypes.STRING(2000),
    allowNull: false,
    validate: {
      len: {
        args: [1, 2000],
        msg: "Review must be between 1 and 2000 characters",
      },
    },
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

export default Review;
