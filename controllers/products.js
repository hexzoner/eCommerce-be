import { Product, Category, Color, Size } from "../db/associations.js";
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
      // sizes: product.sizes.map((size) => {
      //   return {
      //     id: size.id,
      //     name: size.name,
      //   };
      // }),
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
    query: { page, perPage, category, color, size },
  } = req;

  const categories = category ? category.split(",") : [];
  const colors = color ? color.split(",") : [];
  const sizes = size ? size.split(",") : [];

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
      {
        model: Size, // Join the Size table (many-to-many relationship)
        through: { attributes: [] }, // Exclude attributes from the join table (ProductSize)
        where: sizes.length > 0 ? { id: sizes } : {}, // Filter sizes if provided
        required: false, // Include products without sizes (LEFT OUTER JOIN)
      },
    ],
  });
  res.json(products);
};

export const createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  // console.log(product.dataValues);
  res.json(formatedProduct(product));
};

export const getProductById = async (req, res) => {
  const id = req.params.id;
  const product = await Product.findByPk(id, {
    attributes: { exclude: ["categoryId", "colorId"] },
    include: [
      {
        model: Category,
      },
      {
        model: Color,
      },
      {
        model: Size,
        through: { attributes: [] },
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

  const sizes = req.body.sizes;

  const product = await Product.findByPk(id, {
    attributes: { exclude: ["categoryId", "colorId"] },
    include: [
      {
        model: Category,
      },
      {
        model: Color,
      },
      {
        model: Size,
        through: { attributes: [] },
      },
    ],
  });
  if (!product) throw new ErrorResponse("Product not found", 404);
  await product.update(req.body);

  if (sizes) {
    const validSizes = await Size.findAll({ where: { id: sizes } });
    if (validSizes.length !== sizes.length) {
      throw new ErrorResponse("One or more size IDs are invalid.", 400);
    }
    await product.setSizes(sizes);
  }

  // Fetch the updated product, including associated sizes
  const updatedProduct = await Product.findByPk(id, {
    attributes: { exclude: ["categoryId", "colorId"] },
    include: [
      {
        model: Category,
      },
      {
        model: Color,
      },
      {
        model: Size,
        through: { attributes: [] }, // Exclude junction table attributes
      },
    ],
  });

  // Respond with the updated product
  res.json(updatedProduct);
};

export const deleteProduct = async (req, res) => {
  const id = req.params.id;
  const product = await Product.findByPk(id);
  if (!product) throw new ErrorResponse("Product not found", 404);
  await product.destroy();
  res.json("Product " + id + " was deleted successfully");
};
