import Joi from "joi";

const productSchema = {
  POST: Joi.object({
    name: Joi.string().min(1).max(100).required(),
    price: Joi.number().min(1).required(),
    categoryId: Joi.number().integer().required(),
    producerId: Joi.number().integer().required(),
    defaultColorId: Joi.number().integer().required(),
    description: Joi.string().min(1).max(2000).required(),
    details: Joi.string().min(1).max(2000).required(),
    notes: Joi.string().min(1).max(2000).required(),
    instructions: Joi.string().min(1).max(2000).required(),
    image: Joi.string().optional().allow(""),
    sizes: Joi.array().items(Joi.number().integer()).required(),
    defaultSizeId: Joi.number().integer().required(),
    colors: Joi.array().items(Joi.number().integer()).required(),
    rooms: Joi.array().items(Joi.number().integer()).required(),
    features: Joi.array().items(Joi.number().integer()).required(),
    active: Joi.boolean().optional(),
    styleId: Joi.number().integer().required(),
    shapeId: Joi.number().integer().required(),
    techniqueId: Joi.number().integer().required(),
    materialId: Joi.number().integer().required(),
    new: Joi.boolean().optional(),
    bestSeller: Joi.boolean().optional(),
    // mainPatternId: Joi.number().integer().required(),
    patterns: Joi.array().items().required(),
    producerQuote: Joi.string().min(1).max(500).optional().allow(""),
    samplePrice: Joi.number().optional().allow(""),
    shippingDays: Joi.number().min(6).integer().required(),
  }),
  PUT: Joi.object({
    name: Joi.string().min(1).max(100).optional(),
    price: Joi.number().min(1).optional(),
    categoryId: Joi.number().integer().optional(),
    producerId: Joi.number().integer().optional(),
    defaultColorId: Joi.number().integer().optional(),
    description: Joi.string().min(1).max(2000).optional(),
    details: Joi.string().min(1).max(2000).optional(),
    notes: Joi.string().min(1).max(2000).optional(),
    instructions: Joi.string().min(1).max(2000).optional(),
    image: Joi.string().optional().allow(""),
    sizes: Joi.array().items(Joi.number().integer()).optional(),
    defaultSizeId: Joi.number().integer().optional(),
    colors: Joi.array().items(Joi.number().integer()).optional(),
    rooms: Joi.array().items(Joi.number().integer()).optional(),
    features: Joi.array().items(Joi.number().integer()).optional(),
    active: Joi.boolean().optional(),
    styleId: Joi.number().integer().optional(),
    shapeId: Joi.number().integer().optional(),
    techniqueId: Joi.number().integer().optional(),
    materialId: Joi.number().integer().optional(),
    new: Joi.boolean().optional(),
    bestSeller: Joi.boolean().optional(),
    // mainPatternId: Joi.number().integer().optional(),
    patterns: Joi.array().items().optional(),
    producerQuote: Joi.string().min(1).max(500).optional().allow(""),
    samplePrice: Joi.number().optional().allow(""),
    shippingDays: Joi.number().min(6).integer().optional(),
  }),
};

export default productSchema;
