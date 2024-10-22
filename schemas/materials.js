import Joi from "joi";

const materialSchema = {
  POST: Joi.object({
    name: Joi.string().min(2).max(40).required(),
    image: Joi.string().uri().required(),
  }),
  PUT: Joi.object({
    name: Joi.string().min(2).max(40).optional(),
    image: Joi.string().uri().optional(),
  }),
};

export default materialSchema;
