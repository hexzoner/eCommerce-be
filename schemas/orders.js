import Joi from "joi";

const orderSchema = Joi.object({
  products: Joi.array()
    .items(
      Joi.object({
        productId: Joi.number().integer().required(),
        patternId: Joi.number().integer().required(),
        sizeId: Joi.number().integer().required(),
        quantity: Joi.number().integer().min(1).required(),
      })
    )
    .min(0)
    .required(),
  total: Joi.number().min(1).optional(),
  stripeSessionId: Joi.string().required(),
});

export default orderSchema;
