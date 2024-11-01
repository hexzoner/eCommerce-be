import Joi from "joi";

const patternSchema = {
  POST: Joi.object({
    productId: Joi.number().integer().required(),
    name: Joi.string().min(1).max(100).required(),
    icon: Joi.string().required(),
    images: Joi.array().items(Joi.string().uri()).min(1).required(),
    order: Joi.number().integer().optional(),
  }),
  PUT: Joi.object({
    productId: Joi.number().integer().optional(),
    name: Joi.string().min(1).max(100).optional(),
    icon: Joi.string().optional(),
    images: Joi.array().items(Joi.string().uri()).min(1).optional(),
    order: Joi.number().integer().optional(),
  }),
};

export default patternSchema;
