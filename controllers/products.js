import { where } from "sequelize";
import { Product, Category, Color, Size, Producer, Style, Technique, Material, Shape, Room, Feature } from "../db/associations.js";
import { ErrorResponse } from "../utils/ErrorResponse.js";
// import { Op } from "sequelize";

const includeModels = [
  {
    model: Category,
    attributes: ["id", "name"],
  },
  {
    model: Style,
    attributes: ["id", "name", "image"],
  },
  {
    model: Shape,
    attributes: ["id", "name", "image"],
  },
  {
    model: Technique,
    attributes: ["id", "name", "image"],
  },
  {
    model: Material,
    attributes: ["id", "name", "image"],
  },
  {
    model: Producer,
    attributes: ["id", "name", "image", "description"],
  },
  {
    model: Color,
    as: "defaultColor",
    attributes: ["id", "name"],
  },
  {
    model: Color,
    through: { attributes: [] },
    attributes: ["id", "name"],
  },
  {
    model: Size,
    as: "defaultSize",
    attributes: ["id", "name"],
  },
];

const excludeAttributes = ["categoryId", "producerId", "defaultColorId", "defaultSizeId", "styleId"];

export const getProducts = async (req, res) => {
  const {
    query: {
      page,
      perPage,
      category,
      color,
      size,
      producer,
      style,
      shape,
      technique,
      material,
      room,
      feature,
      //search, minPrice, maxPrice, sortBy, order
    },
  } = req;

  const categories = category ? category.split(",") : [];
  const colors = color ? color.split(",") : [];
  const sizes = size ? size.split(",") : [];
  const producers = producer ? producer.split(",") : [];
  const styles = style ? style.split(",") : [];
  const shapes = shape ? shape.split(",") : [];
  const techniques = technique ? technique.split(",") : [];
  const materials = material ? material.split(",") : [];
  const rooms = room ? room.split(",") : [];
  const features = feature ? feature.split(",") : [];

  // Construct the where clause dynamically
  const whereClause = {};
  if (categories.length > 0) whereClause.categoryId = categories;
  if (colors.length > 0) whereClause.defaultColorId = colors;
  if (producers.length > 0) whereClause.producerId = producers;
  if (styles.length > 0) whereClause.styleId = styles;
  if (shapes.length > 0) whereClause.shapeId = shapes;
  if (techniques.length > 0) whereClause.techniqueId = techniques;
  if (materials.length > 0) whereClause.materialId = materials;
  // if (rooms.length > 0) whereClause.roomId = rooms;
  // if (features.length > 0) whereClause.featureId = features;
  // if (sizes.length > 0) whereClause.sizeId = sizes;

  const offset = page ? (page - 1) * perPage : 0;
  const limit = perPage ? perPage : 12;

  const products = await Product.findAll({
    where: whereClause,
    attributes: { exclude: excludeAttributes },
    include: includeModels,
    include: [
      ...includeModels,
      {
        // Include filtering for many-to-many relationship tables
        model: Size,
        attributes: ["id", "name"],
        through: { attributes: [] }, // Exclude attributes from the join table (ProductSize)
        where: sizes.length > 0 ? { id: sizes } : {}, // Filter sizes if provided
        // required: false, // Include products without sizes (LEFT OUTER JOIN)
      },
      {
        model: Feature,
        attributes: ["id", "name", "image"],
        through: { attributes: [] },
        where: features.length > 0 ? { id: features } : {},
      },
      {
        model: Room,
        attributes: ["id", "name", "image"],
        through: { attributes: [] },
        where: rooms.length > 0 ? { id: rooms } : {},
      },
    ],
    order: [["id", "DESC"]],
    offset,
    limit,
  });

  const totalProducts = await Product.count({
    where: whereClause,
  });

  const totalPages = Math.ceil(totalProducts / limit);

  res.json({
    results: products,
    totalResults: totalProducts,
    page,
    totalPages,
  });
  // res.json(products);
};

export const createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  const { sizes, defaultSizeId, colors, producerId } = req.body;

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

  if (colors) {
    const validColors = await Color.findAll({ where: { id: colors } });
    if (validColors.length !== colors.length) {
      throw new ErrorResponse("One or more color IDs are invalid.", 400);
    }
    await product.setColors(colors);
  }

  if (producerId) {
    const producer = await Producer.findByPk(producerId);
    if (!producer) throw new ErrorResponse("Producer ID is invalid.", 400);
  }

  const createdProduct = await Product.findByPk(product.id, {
    attributes: {
      exclude: excludeAttributes,
    },
    include: [
      ...includeModels,
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
    attributes: {
      exclude: excludeAttributes,
    },
    include: [
      ...includeModels,
      {
        model: Size, // Include the default size (one-to-many relationship)
        as: "defaultSize",
        attributes: ["id", "name"],
      },
      {
        model: Size,
        through: { attributes: [] },
        attributes: ["id", "name"],
      },
    ],
    // Ensure the sizes are ordered by their ID in ascending order
    order: [[{ model: Size }, "id", "ASC"]],
  });
  // if (!product) throw new ErrorResponse("Product not found", 404);
  if (!product) res.json({ message: "Product not found", status: 404 });

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

  const { sizes, defaultSizeId, colors, producerId, rooms, features } = req.body;

  const product = await Product.findByPk(id, {
    attributes: { exclude: excludeAttributes },
    include: [
      ...includeModels,
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

    // if (!product.sizes.map((size) => size.id).includes(defaultSizeId)) {
    //   throw new ErrorResponse("Default size ID must be one of the product's sizes.", 400);
    // }
  }

  if (sizes) {
    const validSizes = await Size.findAll({ where: { id: sizes } });
    if (validSizes.length !== sizes.length) {
      throw new ErrorResponse("One or more size IDs are invalid.", 400);
    }
    await product.setSizes(sizes);
  }

  if (colors) {
    const validColors = await Color.findAll({ where: { id: colors } });
    if (validColors.length !== colors.length) {
      throw new ErrorResponse("One or more color IDs are invalid.", 400);
    }
    await product.setColors(colors);
  }

  if (rooms) {
    const validRooms = await Room.findAll({ where: { id: rooms } });
    if (validRooms.length !== rooms.length) {
      throw new ErrorResponse("One or more room IDs are invalid.", 400);
    }
    await product.setRooms(rooms);
  }

  if (features) {
    const validFeatures = await Feature.findAll({ where: { id: features } });
    if (validFeatures.length !== features.length) {
      throw new ErrorResponse("One or more feature IDs are invalid.", 400);
    }
    await product.setFeatures(features);
  }

  if (producerId) {
    const producer = await Producer.findByPk(producerId);
    if (!producer) throw new ErrorResponse("Producer ID is invalid.", 400);
  }

  await product.update(req.body);

  // Fetch the updated product, including associated sizes
  const updatedProduct = await Product.findByPk(id, {
    attributes: { exclude: excludeAttributes },
    include: [
      ...includeModels,
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
