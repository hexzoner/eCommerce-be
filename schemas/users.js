import Joi from "joi";

const userSchema = {
  POST: Joi.object({
    name: Joi.string().min(1).max(30).optional(),
    firstName: Joi.string().max(30).allow("").optional(),
    lastName: Joi.string().max(30).allow("").optional(),
    email: Joi.string().email().required(),
    password: Joi.string().min(2).max(100).required(),
    verified: Joi.boolean().optional().allow(null),
  }),
  PUT: Joi.object({
    name: Joi.string().min(1).max(30).optional(),
    firstName: Joi.string().min(1).max(30).optional(),
    lastName: Joi.string().min(1).max(30).optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(2).max(100).optional(),
    verified: Joi.boolean().optional().allow(null),
  }),
};

export default userSchema;
