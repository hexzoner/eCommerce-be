import Joi from "joi";

const producerSchema = {
  POST: Joi.object({
    name: Joi.string().min(2).max(40).required(),
    description: Joi.string().min(2).max(255).required(),
    image: Joi.string().uri().required(),
  }),
  PUT: Joi.object({
    name: Joi.string().min(2).max(40).optional(),
    description: Joi.string().min(2).max(255).optional(),
    image: Joi.string().uri().optional(),
  }),
};

export default producerSchema;
