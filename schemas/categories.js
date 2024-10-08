import Joi from "joi";

const categorySchema = Joi.object({
  name: Joi.string().min(2).max(40).required(),
});

export default categorySchema;
