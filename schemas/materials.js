import Joi from "joi";

const materialSchema = {
  POST: Joi.object({
    name: Joi.string().min(2).max(40).required(),
    image: Joi.string().required(),
  }),
  PUT: Joi.object({
    name: Joi.string().min(2).max(40).optional(),
    image: Joi.string().optional(),
  }),
};

export default materialSchema;
