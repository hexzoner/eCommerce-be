import { Product, User } from "../db/associations.js";
import { ErrorResponse } from "../utils/ErrorResponse.js";
import Review from "../models/Review.js";

export const getReviews = async (req, res) => {
  const {
    query: { page, perPage },
  } = req;

  const reviews = await Review.findAll({
    attributes: { exclude: ["productId"] },
    include: [
      {
        model: Product,
        attributes: ["id", "name"],
      },
    ],
    order: [["id", "ASC"]],
  });

  res.json(reviews);
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
