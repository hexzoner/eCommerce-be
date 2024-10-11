import Joi from "joi";

const productSchema = {
  POST: Joi.object({
    name: Joi.string().min(1).max(100).required(),
    price: Joi.number().min(1).required(),
    categoryId: Joi.number().integer().required(),
    defaultColorId: Joi.number().integer().required(),
    description: Joi.string().min(1).max(2000).required(),
    details: Joi.string().min(1).max(2000).required(),
    notes: Joi.string().min(1).max(2000).required(),
    instructions: Joi.string().min(1).max(2000).required(),
    image: Joi.string().required(),
    sizes: Joi.array().items(Joi.number().integer()).required(),
    defaultSizeId: Joi.number().integer().required(),
    colors: Joi.array().items(Joi.number().integer()).required(),
    active: Joi.boolean().optional(),
  }),
  PUT: Joi.object({
    name: Joi.string().min(1).max(100).optional(),
    price: Joi.number().min(1).optional(),
    categoryId: Joi.number().integer().optional(),
    defaultColorId: Joi.number().integer().optional(),
    description: Joi.string().min(1).max(2000).optional(),
    details: Joi.string().min(1).max(2000).optional(),
    notes: Joi.string().min(1).max(2000).optional(),
    instructions: Joi.string().min(1).max(2000).optional(),
    image: Joi.string().optional(),
    sizes: Joi.array().items(Joi.number().integer()).optional(),
    defaultSizeId: Joi.number().integer().optional(),
    colors: Joi.array().items(Joi.number().integer()).optional(),
    active: Joi.boolean().optional(),
  }),
};

export default productSchema;
