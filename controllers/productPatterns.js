import { Product, ProductPattern, Pattern, Image } from "../db/associations.js";
import { ErrorResponse } from "../utils/ErrorResponse.js";

export const getProductPatterns = async (req, res) => {
  const {
    query: { productId },
  } = req;

  const productExists = await Product.findByPk(productId);
  if (!productExists) throw new ErrorResponse("Product not found", 404);

  const productPatterns = await Pattern.findAll({
    where: { productId },
    include: [
      {
        model: Product,
        attributes: [],
      },
      {
        model: Image,
        attributes: ["imageURL"],
      },
    ],
    attributes: { exclude: ["createdAt", "updatedAt", "productId"] },
  });

  res.json({
    status: "success",
    results: productPatterns,
  });
};

export const createProductPattern = async (req, res) => {
  const { name, icon, images, productId } = req.body;

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
