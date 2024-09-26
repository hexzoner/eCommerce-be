import { Color } from "../db/associations.js";
import { ErrorResponse } from "../utils/ErrorResponse.js";

function formatedColor(color) {
  return {
    id: color.id,
    name: color.name,
  };
}

export const getColors = async (req, res) => {
  const colors = await Color.findAll({ order: [["id", "ASC"]] });

  res.json(
    colors.map((category) => {
      return formatedColor(category);
    })
  );
};

export const createColor = async (req, res) => {
  const color = await Color.create(req.body);
  res.json(formatedColor(color));
};

export const getColorById = async (req, res) => {
  const {
    params: { id },
  } = req;
  const color = await Color.findByPk(id);
  if (!color) throw new ErrorResponse("Color not found", 404);
  res.json(formatedColor(color));
};

export const updateColor = async (req, res) => {
  const {
    params: { id },
  } = req;

  const color = await Color.findByPk(id);
  if (!color) throw new ErrorResponse("Color not found", 404);
  await color.update(req.body);
  res.json(formatedColor(color));
};

export const deleteColor = async (req, res) => {
  const {
    params: { id },
  } = req;
  const color = await Color.findByPk(id);
  if (!color) throw new ErrorResponse("Color not found", 404);
  await color.destroy();
  res.json({ message: "Color " + id + " deleted successfully" });
};
