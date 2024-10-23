// import { DataTypes } from "sequelize";
import sequelize from "../db/index.js";

export const ProductSize = sequelize.define("productSize", {});
export const ProductColor = sequelize.define("productColor", {});
export const ProductRoom = sequelize.define("productRoom", {});
export const ProductFeature = sequelize.define("productFeature", {});
