import { fn, col } from "sequelize";
import { Product, User } from "../db/associations.js";
import { ErrorResponse } from "../utils/ErrorResponse.js";
import Review from "../models/Review.js";

export const getReviews = async (req, res) => {
  const {
    query: { page, perPage, rating, sort, productId, sortBy },
  } = req;

  const offset = page ? (page - 1) * perPage : 0;
  const limit = perPage ? perPage : 20;

  if (rating) {
    if (rating < 1 || rating > 5) throw new ErrorResponse("Rating must be between 1 and 5", 400);
  }

  if (sort) {
    if (sort !== "asc" && sort !== "desc") throw new ErrorResponse("Sort must be 'asc' or 'desc'", 400);
  }

  if (productId) {
    const productExists = await Product.findByPk(productId);
    if (!productExists) throw new ErrorResponse("Product not found", 404);
  }
  const whereQuery = {
    ...(productId && { productId }),
    ...(rating && { rating }),
  };

  if (sortBy && sortBy !== "rating" && sortBy !== "date" && sortBy !== "id") {
    throw new ErrorResponse("SortBy must be 'rating' or 'date' or 'id'", 400);
  }

  const reviews = await Review.findAll({
    where: whereQuery,
    attributes: { exclude: ["productId"] },
    include: [
      {
        model: Product,
        attributes: ["id", "name"],
      },
    ],
    order: [[sortBy ? sortBy : "id", sort ? sort.toUpperCase() : "DESC"]],
    offset,
    limit,
  });

  const totalReviews = await Review.count({
    where: whereQuery,
  });

  const totalPages = Math.ceil(totalReviews / limit);

  // Calculate the average rating
  const averageRating = await Review.findOne({
    where: whereQuery,
    attributes: [[fn("AVG", col("rating")), "averageRating"]],
    raw: true,
  });

  res.json({
    reviews,
    totalReviews,
    totalPages,
    averageRating: averageRating ? parseFloat(averageRating.averageRating).toFixed(2) : null,
  });
};

const getReviewQuery = {
  attributes: { exclude: ["productId"] },
  include: [
    {
      model: Product,
      attributes: ["id", "name"],
    },
  ],
};

export const getReviewById = async (req, res) => {
  const {
    params: { id },
  } = req;

  const review = await Review.findByPk(id, getReviewQuery);

  if (!review) throw new ErrorResponse("Review not found", 404);

  res.json(review);
};

export const createReview = async (req, res) => {
  const userId = req.userId;
  const { productId, rating, review, author, title, image, date } = req.body;

  const userFound = await User.findByPk(userId);
  if (!userFound) throw new ErrorResponse("User not found", 404);

  //   const product = await Product.findByPk(productId);
  //   if (!product) throw new ErrorResponse("Product not found", 404);

  const newReview = await Review.create({
    author,
    rating,
    title,
    review,
    image,
    productId,
    date,
  });

  const populatedReview = await Review.findByPk(newReview.id, getReviewQuery);

  res.status(201).json(populatedReview);
};

export const updateReview = async (req, res) => {
  const {
    params: { id },
    body: { rating, review, author, title, image, productId, date },
  } = req;

  const reviewFound = await Review.findByPk(id);
  if (!reviewFound) throw new ErrorResponse("Review not found", 404);

  if (rating) reviewFound.rating = rating;
  if (review) reviewFound.review = review;
  if (author) reviewFound.author = author;
  if (title) reviewFound.title = title;
  if (image) reviewFound.image = image;
  if (productId) reviewFound.productId = productId;
  if (date) reviewFound.date = date;

  await reviewFound.save();

  const populatedReview = await Review.findByPk(id, getReviewQuery);

  res.json(populatedReview);
};

export const deleteReview = async (req, res) => {
  const {
    params: { id },
  } = req;

  const reviewFound = await Review.findByPk(id);
  if (!reviewFound) throw new ErrorResponse("Review not found", 404);

  await reviewFound.destroy();

  res.json({
    status: "success",
    message: "Review deleted successfully",
  });
};
