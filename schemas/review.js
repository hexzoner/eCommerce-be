import Joi from "joi";

const reviewSchema = {
  POST: Joi.object({
    productId: Joi.number().integer().required(),
    // userId: Joi.number().integer().required(),
    rating: Joi.number().integer().min(1).max(5).required(),
    review: Joi.string().min(1).max(2000).required(),
    author: Joi.string().min(1).max(100).required(),
    title: Joi.string().min(1).max(100).required(),
    date: Joi.date().optional(),
    image: Joi.string().optional(),
  }),
  PUT: Joi.object({
    rating: Joi.number().integer().min(1).max(5).optional(),
    review: Joi.string().min(1).max(2000).optional(),
    author: Joi.string().min(1).max(100).optional(),
    title: Joi.string().min(1).max(100).optional(),
    image: Joi.string().optional(),
    date: Joi.date().optional(),
    productId: Joi.number().integer().optional(),
  }),
};

export default reviewSchema;
