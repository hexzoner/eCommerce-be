import Joi from "joi";

const patternSchema = {
  POST: Joi.object({
    name: Joi.string().min(1).max(100).required(),
    image: Joi.string().required(),
  }),
  PUT: Joi.object({
    name: Joi.string().min(1).max(100).optional(),
    image: Joi.string().optional(),
  }),
};

export default patternSchema;
