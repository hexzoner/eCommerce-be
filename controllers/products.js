import { Product, Category, Color } from "../db/associations.js";
import { ErrorResponse } from "../utils/ErrorResponse.js";
import { Op } from "sequelize";

function formatedResults(products) {
  return products.map((product) => {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: {
        id: product.category.id,
        name: product.category.name,
      },
      color: {
        id: product.color.id,
        name: product.color.name,
      },
      createdAt: product.createdAt,
      image: product.image,
    };
  });
}

function formatedProduct(product) {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.categoryId,
    image: product.image,
    color: product.colorId,
  };
}

export const getProducts = async (req, res) => {
  // const categoryId = req.query.category;
  const {
    query: { page, perPage, category, color },
  } = req;

  const categories = category ? category.split(",") : [];
  const colors = color ? color.split(",") : [];

  const products = await Product.findAll({
    where: {
      categoryId: categories.length > 0 ? categories : { [Op.ne]: null },
      colorId: colors.length > 0 ? colors : { [Op.ne]: null },
    },
    attributes: { exclude: ["categoryId", "colorId"] },
    include: [
      {
        model: Category,
      },
      {
        model: Color,
      },
    ],
  });
  res.json(formatedResults(products));
};

export const createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  // console.log(product.dataValues);
  res.json(formatedProduct(product));
};

export const getProductById = async (req, res) => {
  const id = req.params.id;
  const product = await Product.findByPk(id, {
    include: [
      {
        model: Category,
      },
      {
        model: Color,
      },
    ],
  });
  if (!product) throw new ErrorResponse("Product not found", 404);
  res.json(product);
};

export const updateProduct = async (req, res) => {
  const {
    params: { id },
  } = req;
  const product = await Product.findByPk(id);
  if (!product) throw new ErrorResponse("Product not found", 404);
  await product.update(req.body);
  res.json(product);
};

export const deleteProduct = async (req, res) => {
  const id = req.params.id;
  const product = await Product.findByPk(id);
  if (!product) throw new ErrorResponse("Product not found", 404);
  await product.destroy();
  res.json("Product " + id + " was deleted successfully");
};
