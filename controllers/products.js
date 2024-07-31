import { Product, Category } from "../db/associations.js";
import { ErrorResponse } from "../utils/ErrorResponse.js";

function formatedResults(products) {
  return products.map((product) => {
    return formatedProduct(product);
  });
}

function formatedProduct(product) {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    categoryId: product.categoryId,
  };
}

export const getProducts = async (req, res) => {
  const categoryId = req.query.category;
  let products = [];
  if (categoryId) products = await Product.findAll({ where: { categoryId } });
  else products = await Product.findAll();

  res.json(formatedResults(products));
};

export const createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.json(formatedProduct(product));
};

export const getProductById = async (req, res) => {
  const id = req.params.id;
  const product = await Product.findByPk(id, { include: Category });
  if (!product) throw new ErrorResponse("Product not found", 404);
  res.json(formatedProduct(product));
};

export const updateProduct = async (req, res) => {
  const {
    params: { id },
  } = req;
  const product = await Product.findByPk(id);
  if (!product) throw new ErrorResponse("Product not found", 404);
  await product.update(req.body);
  res.json(formatedProduct(product));
};

export const deleteProduct = async (req, res) => {
  const id = req.params.id;
  const product = await Product.findByPk(id);
  if (!product) throw new ErrorResponse("Product not found", 404);
  await product.destroy();
  res.json("Product " + id + " was deleted successfully");
};
