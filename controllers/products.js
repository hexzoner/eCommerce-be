import { Product, Category, Color, Size } from "../db/associations.js";
import { ErrorResponse } from "../utils/ErrorResponse.js";
import { Op } from "sequelize";

// function formatedResults(products) {
//   return products.map((product) => {
//     return {
//       id: product.id,
//       name: product.name,
//       description: product.description,
//       price: product.price,
//       category: {
//         id: product.category.id,
//         name: product.category.name,
//       },
//       color: {
//         id: product.color.id,
//         name: product.color.name,
//       },
//       createdAt: product.createdAt,
//       image: product.image,
//       // sizes: product.sizes.map((size) => {
//       //   return {
//       //     id: size.id,
//       //     name: size.name,
//       //   };
//       // }),
//     };
//   });
// }

// function formatedProduct(product) {
//   return {
//     id: product.id,
//     name: product.name,
//     description: product.description,
//     price: product.price,
//     category: product.categoryId,
//     image: product.image,
//     color: product.colorId,
//   };
// }

export const getProducts = async (req, res) => {
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
    attributes: { exclude: ["categoryId", "colorId", "defaultSizeId"] },
    include: [
      {
        model: Category,
        attributes: ["id", "name"],
      },
      {
        model: Color,
        attributes: ["id", "name"],
      },
      {
        model: Size, // Join the Size table (many-to-many relationship)
        attributes: ["id", "name"],
        through: { attributes: [] }, // Exclude attributes from the join table (ProductSize)
        where: sizes.length > 0 ? { id: sizes } : {}, // Filter sizes if provided
        required: false, // Include products without sizes (LEFT OUTER JOIN)
      },
      {
        model: Size, // Include the default size (one-to-many relationship)
        as: "defaultSize",
        attributes: ["id", "name"],
      },
    ],
    order: [[{ model: Size }, "id", "ASC"]],
  });

  // Convert products instances to plain JavaScript objects and set the default size to the first size if it doesn't exist
  const productsData = products.map((product) => {
    const productData = product.toJSON();
    if (!productData.defaultSize && productData.sizes.length > 0) {
      productData.defaultSize = {
        id: productData.sizes[0].id,
        name: productData.sizes[0].name,
      };
    }
    return productData;
  });

  res.json(productsData);
};

export const createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  const { sizes, defaultSizeId } = req.body;

  if (sizes) {
    const validSizes = await Size.findAll({ where: { id: sizes } });
    if (validSizes.length !== sizes.length) {
      throw new ErrorResponse("One or more size IDs are invalid.", 400);
    }
    await product.setSizes(sizes);
  }

  if (defaultSizeId) {
    const size = await Size.findByPk(defaultSizeId);
    if (!size) throw new ErrorResponse("Default size ID is invalid.", 400);
  }

  const createdProduct = await Product.findByPk(product.id, {
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

  if (!createdProduct.defaultSize && createdProduct.sizes.length > 0) createdProduct.defaultSizeId = createdProduct.sizes[0].id;
  res.json(createdProduct);
};

export const getProductById = async (req, res) => {
  const id = req.params.id;
  const product = await Product.findByPk(id, {
    attributes: { exclude: ["categoryId", "colorId", "defaultSizeId", "createdAt", "updatedAt"] },
    include: [
      {
        model: Category,
        attributes: ["id", "name"],
      },
      {
        model: Color,
        attributes: ["id", "name"],
      },
      {
        model: Size,
        through: { attributes: [] },
        attributes: ["id", "name"],
      },
      {
        model: Size, // Include the default size (one-to-many relationship)
        as: "defaultSize",
        attributes: ["id", "name"],
      },
    ],
    // Ensure the sizes are ordered by their ID in ascending order
    order: [[{ model: Size }, "id", "ASC"]],
  });
  if (!product) throw new ErrorResponse("Product not found", 404);

  // Convert product instance to plain JavaScript object
  const productData = product.toJSON();

  // If the product has sizes, set the default size to the first size
  if (!productData.defaultSize && productData.sizes.length > 0) {
    productData.defaultSize = {
      id: productData.sizes[0].id,
      name: productData.sizes[0].name,
    };
  }

  res.json(productData);
};

export const updateProduct = async (req, res) => {
  const {
    params: { id },
  } = req;

  const { sizes, defaultSizeId } = req.body;

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

  if (defaultSizeId) {
    const size = await Size.findByPk(defaultSizeId);
    if (!size) throw new ErrorResponse("Default size ID is invalid.", 400);

    if (!product.sizes.map((size) => size.id).includes(defaultSizeId)) {
      throw new ErrorResponse("Default size ID must be one of the product's sizes.", 400);
    }
  }

  if (sizes) {
    const validSizes = await Size.findAll({ where: { id: sizes } });
    if (validSizes.length !== sizes.length) {
      throw new ErrorResponse("One or more size IDs are invalid.", 400);
    }
    await product.setSizes(sizes);
  }

  await product.update(req.body);

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

  if (!product.defaultSize && product.sizes.length > 0) product.defaultSizeId = product.sizes[0].id;
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
