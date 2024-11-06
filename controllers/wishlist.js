import { Product, User, Category, Color, Size, Pattern, Image } from "../db/associations.js";
import Wishlist from "../models/wishlist.js";
import { ErrorResponse } from "../utils/ErrorResponse.js";

export const GetWishlist = async (req, res) => {
  const userId = req.userId;
  const userWishlist = await User.findByPk(userId, {
    include: {
      model: Product,
      as: "WishlistProducts", // Alias for wishlist
      through: { attributes: [] }, // This will exclude the Wishlist join table from the response
      include: [
        { model: Category, attributes: ["name"] }, // Include category name
        { model: Color, attributes: ["name"] }, // Include color name
        { model: Size, attributes: ["name"] }, // Include size name
        // {
        //   model: Pattern,
        //   attributes: ["name", "icon", "active", "order"],
        //   include: [
        //     {
        //       model: Image,
        //       attributes: ["id", "imageURL", "order"],
        //       separate: true,
        //       order: [["order", "ASC"]],
        //     },
        //   ],
        // },
      ],
      // order: [
      //   [Pattern, "order", "ASC"],
      //   ["id", "DESC"],
      // ],
    },
  });

  for (let i = 0; i < userWishlist.WishlistProducts.length; i++) {
    const product = userWishlist.WishlistProducts[i];
    const patterns = await Pattern.findAll({
      where: { productId: product.id },
      include: [
        {
          model: Image,
          attributes: ["id", "imageURL", "order"],
        },
      ],
      order: [["order", "ASC"]],
    });

    // Sort images by order
    patterns.forEach((pattern) => {
      pattern.images.sort((a, b) => a.order - b.order);
    });

    product.dataValues.patterns = patterns;
  }

  res.json(userWishlist.WishlistProducts);
};

export const AddToWishlist = async (req, res) => {
  const userId = req.userId;
  const { productId } = req.body;

  if (!productId) throw new ErrorResponse("ProductId is required", 400);

  const productExist = await Product.findByPk(productId);
  if (!productExist) throw new ErrorResponse("Invalid Product", 404);

  const user = await User.findByPk(userId);
  if (!user) throw new ErrorResponse("User not found", 404);

  const product = await Product.findByPk(productId);
  if (!product) throw new ErrorResponse("Product not found", 404);

  //This uses array destructuring to assign the results of the findOrCreate method to two variables:
  //wishlist-This will contain the found or newly created record.
  //created-This is a boolean value that indicates whether a new record was created (true) or an existing record was found (false).
  const [wishlist, created] = await Wishlist.findOrCreate({ where: { userId, productId } });
  if (!created) throw new ErrorResponse("Product already in wishlist", 400);

  const response = {
    status: "success",
    message: "Product added to wishlist",
    data: wishlist,
  };
  res.json(response);
};

export const RemoveFromWishlist = async (req, res) => {
  const userId = req.userId;
  const productId = req.params.id;

  if (!productId) throw new ErrorResponse("ProductId is required", 400);

  const wishlist = await Wishlist.findOne({ where: { userId, productId } });
  if (!wishlist) throw new ErrorResponse("Product is not in wishlist", 404);

  await wishlist.destroy();
  res.json({
    status: "success",
    message: "Product removed from wishlist",
  });
};
