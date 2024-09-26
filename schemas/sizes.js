import Joi from "joi";

const sizeSchema = Joi.object({
  name: Joi.string().min(2).max(40).required(),
});

export default sizeSchema;