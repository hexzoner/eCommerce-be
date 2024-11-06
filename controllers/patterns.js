import { Product, Pattern, Image } from "../db/associations.js";
import { ErrorResponse } from "../utils/ErrorResponse.js";
import { deleteImageFromS3 } from "../images-upload/upload-image-s3.js";

const getPatternQueryOptions = {
  include: [
    {
      model: Image,
      attributes: ["id", "imageURL", "order"],
    },
  ],
  attributes: { exclude: ["createdAt", "updatedAt", "productId"] },
  // order: [
  //   ["id", "ASC"],
  //   [Image, "order", "ASC"],
  // ],
};

export const getProductPatterns = async (req, res) => {
  const {
    params: { id },
  } = req;

  const productExists = await Product.findByPk(id);
  if (!productExists) throw new ErrorResponse("Product not found", 404);

  const productPatterns = await Pattern.findAll({
    ...getPatternQueryOptions,
    where: { productId: id },
    order: [["order", "ASC"]],
  });

  const allImages = await Image.findAll();

  res.json({
    status: "success",
    results: productPatterns,
    images: allImages,
  });
};

export const createProductPattern = async (req, res) => {
  const { images, productId } = req.body;

  const productExists = await Product.findByPk(productId);
  if (!productExists) throw new ErrorResponse("Product not found", 404);

  const pattern = await Pattern.create(req.body);

  if (!images) throw new ErrorResponse("At least one image is required", 400);

  // Create images for the pattern
  if (images) {
    for (const img of images) {
      await Image.create({ imageURL: img, patternId: pattern.id });
    }
  }

  res.status(201).json(pattern);
};

export const updateProductPattern = async (req, res) => {
  const {
    params: { id },
    body: { name, icon, images },
  } = req;

  const pattern = await Pattern.findByPk(id);
  if (!pattern) throw new ErrorResponse("Pattern not found", 404);

  const productId = pattern.productId;
  if (!productId) throw new ErrorResponse("Product ID is required", 400);

  const productExists = await Product.findByPk(productId);
  if (!productExists) throw new ErrorResponse("Product not found", 404);

  await pattern.update({ name, icon, productId });

  if (images) {
    await Image.destroy({ where: { patternId: id } });
    for (const img of images) {
      await Image.create({ imageURL: img, patternId: id });
    }
  }

  // Re-fetch the pattern including the new images
  const updatedPattern = await Pattern.findByPk(id, getPatternQueryOptions);

  // Respond with the updated pattern including images
  res.json(updatedPattern);
};

export const deleteProductPattern = async (req, res) => {
  const { id } = req.params;

  const pattern = await Pattern.findByPk(id);
  if (!pattern) throw new ErrorResponse("Pattern not found", 404);

  const imagesToDelete = await Image.findAll({ where: { patternId: id } });
  for (const img of imagesToDelete) {
    await deleteImageFromS3(img.imageURL);
  }
  await deleteImageFromS3(pattern.icon);

  await Image.destroy({ where: { patternId: id } });

  await pattern.destroy();

  res.json({ message: "Product Pattern deleted successfully" });
};

export const getPatternById = async (req, res) => {
  const { id } = req.query;

  const pattern = await Pattern.findByPk(id, getPatternQueryOptions);

  if (!pattern) throw new ErrorResponse("Pattern not found", 404);

  res.json(pattern);
};
