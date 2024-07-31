import Joi from "joi";

const userSchema = {
  POST: Joi.object({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(4).max(30).required(),
  }),
  PUT: Joi.object({
    name: Joi.string().min(2).max(30).optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(4).max(30).optional(),
  }),
};

export default userSchema;
