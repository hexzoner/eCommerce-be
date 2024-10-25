import { Product, ProductPattern } from "../db/associations.js";
import { ErrorResponse } from "../utils/ErrorResponse.js";

export const getProductPatterns = async (req, res) => {
  const {
    query: { productId, name },
  } = req;

  const productExists = await Product.findByPk(productId);
  if (!productExists) throw new ErrorResponse("Product not found", 404);

  const productPatterns = await ProductPattern.findAll({
    where: { productId, name },
    order: [["name", "ASC"]],
  });

  res.json(productPatterns);
};

export const createProductPattern = async (req, res) => {
  const { productId } = req.query;
  const { name, image } = req.body;

  const productExists = await Product.findByPk(productId);
  if (!productExists) throw new ErrorResponse("Product not found", 404);

  const productPattern = await ProductPattern.create({ name, image, productId });

  res.status(201).json(productPattern);
};

export const updateProductPattern = async (req, res) => {
  const { id } = req.params;
  const { name, image } = req.body;

  const productPattern = await ProductPattern.findByPk(id);
  if (!productPattern) throw new ErrorResponse("Product Pattern not found", 404);

  if (name) productPattern.name = name;
  if (image) productPattern.image = image;
  await productPattern.save();

  res.json(productPattern);
};

export const deleteProductPattern = async (req, res) => {
  const { id } = req.params;

  const productPattern = await ProductPattern.findByPk(id);
  if (!productPattern) throw new ErrorResponse("Product Pattern not found", 404);

  await productPattern.destroy();

  res.json({ message: "Product Pattern deleted successfully" });
};
