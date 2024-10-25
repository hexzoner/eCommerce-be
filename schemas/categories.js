import Joi from "joi";

const categorySchema = Joi.object({
  name: Joi.string().min(2).max(40).required(),
  image: Joi.string().min(1).max(500),
});

export default categorySchema;
