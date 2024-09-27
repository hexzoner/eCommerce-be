import Joi from "joi";

const productSchema = {
  POST: Joi.object({
    name: Joi.string().min(1).max(100).required(),
    price: Joi.number().min(1).required(),
    categoryId: Joi.number().integer().required(),
    defaultColorId: Joi.number().integer().required(),
    description: Joi.string().min(1).max(1000).required(),
    image: Joi.string().required(),
    sizes: Joi.array().items(Joi.number().integer()).required(),
    defaultSizeId: Joi.number().integer().required(),
    colors: Joi.array().items(Joi.number().integer()).required(),
  }),
  PUT: Joi.object({
    name: Joi.string().min(1).max(100).optional(),
    price: Joi.number().min(1).optional(),
    categoryId: Joi.number().integer().optional(),
    defaultColorId: Joi.number().integer().optional(),
    description: Joi.string().min(1).max(1000).optional(),
    image: Joi.string().optional(),
    sizes: Joi.array().items(Joi.number().integer()).optional(),
    defaultSizeId: Joi.number().integer().optional(),
    colors: Joi.array().items(Joi.number().integer()).optional(),
  }),
};

export default productSchema;
