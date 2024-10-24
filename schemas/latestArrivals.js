import Joi from "joi";

const latestArrivalsSchema = {
  POST: Joi.object({
    name: Joi.string().min(2).max(40).required(),
    image: Joi.string().uri().required(),
    link: Joi.string().uri().required(),
  }),

  PUT: Joi.object({
    name: Joi.string().min(2).max(40).optional(),
    image: Joi.string().uri().optional(),
    link: Joi.string().uri().optional(),
  }),
};

export default latestArrivalsSchema;
