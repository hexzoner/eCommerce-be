import Joi from "joi";

const productSchema = {
  POST: Joi.object({
    name: Joi.string().min(2).max(30).required(),
    price: Joi.number().min(1).required(),
    categoryId: Joi.number().integer().required(),
    description: Joi.string().min(2).max(200).required(),
  }),
  PUT: Joi.object({
    name: Joi.string().min(2).max(30).optional(),
    price: Joi.number().min(1).optional(),
    categoryId: Joi.number().integer().optional(),
    description: Joi.string().min(2).max(200).optional(),
  }),
};

export default productSchema;
