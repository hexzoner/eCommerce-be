// import { where } from "sequelize";
import {
  ProductPrice,
  Product,
  Category,
  Color,
  Size,
  Producer,
  Style,
  Technique,
  Material,
  Shape,
  Room,
  Feature,
  Pattern,
  Image,
} from "../db/associations.js";
import { ErrorResponse } from "../utils/ErrorResponse.js";
import { deleteImageFromS3 } from "../images-upload/upload-image-s3.js";
import stripe from "stripe";
const stripeSession = stripe(process.env.STRIPE_SECRET_KEY);
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
    attributes: ["id", "name", "squareMeters"],
  },
  { model: Feature, attributes: ["id", "name", "image"] },
  { model: Room, attributes: ["id", "name"] },
  {
    model: Pattern,
    attributes: ["id", "name", "icon", "active", "order"],
    include: [
      {
        model: Image,
        attributes: ["id", "imageURL", "order"],
        separate: true,
        order: [["order", "ASC"]],
      },
    ],
  },
];

const excludeAttributes = ["categoryId", "producerId", "defaultColorId", "defaultSizeId", "styleId", "shapeId", "techniqueId", "materialId"];

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
      isNew,
      isBestSeller,
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
  if (isNew != undefined) whereClause.new = isNew;
  if (isBestSeller != undefined) whereClause.bestSeller = isBestSeller;
  // if (rooms.length > 0) whereClause.roomId = rooms;
  // if (features.length > 0) whereClause.featureId = features;
  // if (sizes.length > 0) whereClause.sizeId = sizes;

  const offset = page ? (page - 1) * perPage : 0;
  const limit = perPage ? perPage : 12;

  const products = await Product.findAll({
    where: whereClause,
    attributes: { exclude: excludeAttributes },
    include: [
      ...includeModels,
      {
        // Include filtering for many-to-many relationship tables
        model: Size,
        attributes: ["id", "name", "squareMeters"],
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
    order: [
      [Pattern, "order", "ASC"],
      [Size, "squareMeters", "ASC"],
      ["id", "DESC"],
    ],
    offset,
    limit,
  });

  const totalProducts = await Product.count({
    where: whereClause,
    include: [
      {
        model: Size,
        attributes: [], // No need for attributes in count query
        through: { attributes: [] }, // Exclude join table attributes
        where: sizes.length > 0 ? { id: sizes } : {},
      },
      {
        model: Feature,
        attributes: [],
        through: { attributes: [] },
        where: features.length > 0 ? { id: features } : {},
      },
      {
        model: Room,
        attributes: [],
        through: { attributes: [] },
        where: rooms.length > 0 ? { id: rooms } : {},
      },
    ],
    distinct: true, // Ensure that we count distinct products
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
  const { sizes, defaultSizeId, colors, producerId, patterns, rooms, features } = req.body;

  if (sizes) {
    const validSizes = await Size.findAll({ where: { id: sizes } });
    if (validSizes.length !== sizes.length) {
      throw new ErrorResponse("One or more size IDs are invalid.", 400);
    }
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
  }

  if (rooms) {
    const validRooms = await Room.findAll({ where: { id: rooms } });
    if (validRooms.length !== rooms.length) {
      throw new ErrorResponse("One or more room IDs are invalid.", 400);
    }
  }

  if (features) {
    const validFeatures = await Feature.findAll({ where: { id: features } });
    if (validFeatures.length !== features.length) {
      throw new ErrorResponse("One or more feature IDs are invalid.", 400);
    }
  }

  if (producerId) {
    const producer = await Producer.findByPk(producerId);
    if (!producer) throw new ErrorResponse("Producer ID is invalid.", 400);
  }

  const product = await Product.create(req.body);
  await product.setSizes(sizes);
  await product.setColors(colors);
  await product.setRooms(rooms);
  await product.setFeatures(features);

  if (patterns) {
    for (const pattern of patterns) {
      // const newPattern = await Pattern.findByPk(pattern.id);
      createNewPattern(pattern, product);
    }
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
        attributes: ["id", "name", "squareMeters"],
      },
      {
        model: Size,
        through: { attributes: [] },
        attributes: ["id", "name", "squareMeters"],
      },
    ],
    // Ensure the sizes are ordered by their ID in ascending order
    order: [
      [Size, "squareMeters", "ASC"],
      [Pattern, "order", "ASC"],
    ],
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

async function createNewPattern(pattern, product) {
  // const newPatternBody = {
  //   name: pattern.name,
  //   icon: pattern.icon,
  //   active: pattern.active,
  //   order: pattern.order,
  //   id: pattern.id,
  // };
  const newPattern = await Pattern.create(pattern);
  await product.addPattern(newPattern);

  // Save associated images
  if (pattern.images) {
    const imagePromises = pattern.images.map(async (image) => {
      return await Image.create({ imageURL: image.imageURL, patternId: newPattern.id, order: image.order });
    });
    await Promise.all(imagePromises); // Wait for all images to be saved
  }
}

export const updateProduct = async (req, res) => {
  const {
    params: { id },
  } = req;

  const { sizes, defaultSizeId, colors, producerId, rooms, features, mainPatternId, patterns, price } = req.body;

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

  if (mainPatternId) {
    const pattern = await Pattern.findByPk(mainPatternId);
    if (!pattern) throw new ErrorResponse("Main pattern ID is invalid.", 400);

    if (!product.patterns.map((p) => p.id).includes(mainPatternId))
      throw new ErrorResponse("Default pattern ID must be one of the product's patterns.", 400);

    await product.setMainPattern(pattern);
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

  if (patterns) {
    // Create or Update patterns in the database
    for (const pattern of patterns) {
      const patternExists = await Pattern.findByPk(pattern.id);

      // If the pattern does not exist, create it
      if (!patternExists) {
        const newPattern = await Pattern.create(pattern);
        await product.addPattern(newPattern);

        // Save associated images
        if (pattern.images) {
          const imagePromises = pattern.images.map(async (image) => {
            return await Image.create({ imageURL: image.imageURL, patternId: newPattern.id, order: image.order });
          });
          await Promise.all(imagePromises); // Wait for all images to be saved
        }
      } else {
        // If the pattern exists, update it
        const oldIconUrl = patternExists.icon;
        if (oldIconUrl && oldIconUrl !== pattern.icon) await deleteImageFromS3(oldIconUrl); // Delete old icon from S3

        // Fetch existing images for this pattern
        const existingImages = await Image.findAll({ where: { patternId: patternExists.id } });

        // Get URLs of existing images
        const existingImageURLs = existingImages.map((img) => img.imageURL);

        // Determine which images to keep, delete, or add
        const incomingImageURLs = pattern.images.map((img) => img.imageURL);

        // Find images to delete (those that are in existing but not in incoming)
        const imagesToDelete = existingImages.filter((img) => !incomingImageURLs.includes(img.imageURL));
        for (const img of imagesToDelete) {
          await deleteImageFromS3(img.imageURL); // Delete from S3
        }

        await Image.destroy({ where: { patternId: patternExists.id, imageURL: imagesToDelete.map((img) => img.imageURL) } });

        // Find images to add (those that are in incoming but not in existing)
        const imagesToAdd = pattern.images.filter((img) => !existingImageURLs.includes(img.imageURL));
        const imagePromises = imagesToAdd.map(async (image) => {
          return await Image.create({
            imageURL: image.imageURL,
            patternId: patternExists.id,
            order: image.order,
          });
        });
        await Promise.all(imagePromises); // Wait for all new images to be saved

        //Update the pattern images order
        for (const img of pattern.images) {
          const imageToUpdate = await Image.findOne({ where: { patternId: patternExists.id, id: img.id } });
          if (imageToUpdate) await imageToUpdate.update({ order: img.order });
        }

        // Update the pattern itself
        await patternExists.update(pattern);
      }
    }

    // Optionally, set patterns to the product (if you want to ensure only the given patterns are associated)
    await product.setPatterns(patterns.map((p) => p.id)); // Set only the current patterns
  }

  if (price && price != product.price) {
    for (const s of product.sizes) {
      try {
        await stripeLogicPerSize(s.id, product, price);
      } catch (error) {
        console.log(error);
        throw new ErrorResponse("Error updating Stripe prices: " + error.message, 500);
      }
    }
  }

  if (sizes) {
    const validSizes = await Size.findAll({ where: { id: sizes } });
    if (validSizes.length !== sizes.length) {
      throw new ErrorResponse("One or more size IDs are invalid.", 400);
    }
    await product.setSizes(sizes);

    const newlyAddedSizes = sizes.filter((size) => !product.sizes.map((s) => s.id).includes(size));

    for (const s of newlyAddedSizes) {
      try {
        await stripeLogicPerSize(s, product, price);
      } catch (error) {
        console.log(error);
        throw new ErrorResponse("Error updating Stripe prices: " + error.message, 500);
      }
    }

    // Delete Stripe prices for sizes that are no longer associated with the product
    const productPrices = await ProductPrice.findAll({ where: { productId: product.id } });
    // const stripeSession = stripe(process.env.STRIPE_SECRET_KEY);

    for (const productPrice of productPrices) {
      if (!sizes.includes(productPrice.sizeId)) {
        if (productPrice.stripePriceId) {
          // Deactivate the Stripe price
          await stripeSession.prices.update(productPrice.stripePriceId, { active: false });
        }
        try {
          await ProductPrice.destroy({ where: { id: productPrice.id } });
        } catch (error) {
          console.error(`Failed to delete ProductPrice with id ${productPrice.id}:`, error);
        }
        await ProductPrice.destroy({ where: { id: productPrice.id } });
      }
    }
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
  const productPrices = await ProductPrice.findAll({ where: { productId: product.id } });

  // Delete all Stripe prices associated with the product
  for (const productPrice of productPrices) {
    if (productPrice.stripePriceId) {
      await stripeSession.prices.del(productPrice.stripePriceId);
    }
  }

  // Delete all prices associated with the product
  await ProductPrice.destroy({ where: { productId: product.id } });

  // Delete all images associated with the product patterns

  const patterns = await product.getPatterns();
  for (const pattern of patterns) {
    const images = await pattern.getImages();
    for (const image of images) {
      await Image.destroy({ where: { id: image.id } });
      await deleteImageFromS3(image.imageURL);
    }
  }

  // Delete all patterns associated with the product
  await product.removePatterns();

  await product.destroy();
  res.json("Product " + id + " was deleted successfully");
};

async function stripeLogicPerSize(sizeId, product, price) {
  // const _product = await Product.findByPk(product.id);
  const productPrice = await ProductPrice.findOne({ where: { productId: product.id, sizeId } });
  const size = await Size.findByPk(sizeId);
  if (!size) throw new ErrorResponse("Size not found", 404);

  const newTotalPrice = Math.round(price * size.squareMeters * 100); // Multiply by 100 to convert to cents
  // console.log("---- New Total Price ----" + newTotalPrice);
  // const stripeProductExists = await stripeSession.products.retrieve(productPrice.stripeProductId);

  // return;
  if (productPrice && productPrice.stripeProductId) {
    // console.log("---- Product Price found ----" + productPrice.stripeProductId);
    // if (!_product.stripeProductId) await _product.update({ stripeProductId: productPrice.stripeProductId });

    if (productPrice.price === newTotalPrice) return; // No need to update the price

    // Update existing Stripe price
    const newStripePrice = await stripeSession.prices.create({
      unit_amount: newTotalPrice,
      currency: "eur",
      product: productPrice.stripeProductId,
    });
    // Update the price in your database
    await productPrice.update({ productId: product.id, sizeId, price: newTotalPrice, stripePriceId: newStripePrice.id });
  } else {
    // Create Stripe product only if it doesn't already exist
    // console.log("---- Product Price or Stripe Product ID not found ----");
    let stripeProduct;
    if (!productPrice?.stripeProductId) {
      stripeProduct = await stripeSession.products.create({ name: product.name });
    } else {
      stripeProduct = await stripeSession.products.retrieve(productPrice.stripeProductId);
    }
    // Save the Stripe product ID in the product table
    // await _product.update({ stripeProductId: stripeProduct.id });

    // Create or update price in Stripe
    const stripePrice = await stripeSession.prices.create({
      unit_amount: newTotalPrice,
      currency: "eur",
      product: stripeProduct.id,
    });

    // Create or update the product price entry in the database

    if (!productPrice) {
      await ProductPrice.create({
        productId: product.id,
        sizeId,
        price: newTotalPrice,
        stripePriceId: stripePrice.id, // Corrected assignment
        stripeProductId: stripeProduct.id, // Track the product in your DB for future use
      });
    } else {
      await productPrice.update({
        productId: product.id,
        sizeId,
        price: newTotalPrice,
        stripePriceId: stripePrice.id,
        stripeProductId: stripeProduct.id,
      });
    }
  }
}

// async function getStripeProductId(id) {
//   const productPrice = await ProductPrice.findOne({ where: { productId: id } });
//   const stripeProductId = productPrice?.stripeProductId || "";
//   return stripeProductId;
// }
