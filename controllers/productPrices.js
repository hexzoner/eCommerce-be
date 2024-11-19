import { ProductPrice, Size } from "../db/associations.js";
// import { ErrorResponse } from "../utils/ErrorResponse.js";

export const getProductPrices = async (req, res) => {
  const productPrices = await ProductPrice.findAll();
  res.json(productPrices);
};

export const getProductPricesById = async (req, res) => {
  const {
    params: { id },
  } = req;
  const productPrices = await ProductPrice.findAll({
    where: { productId: id },
    attributes: { exclude: ["createdAt", "updatedAt", "productId"] },
    include: {
      model: Size,
      attributes: ["id", "name", "squareMeters"],
    },
  });

  res.json(productPrices);
};
