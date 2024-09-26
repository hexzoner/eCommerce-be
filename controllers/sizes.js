import { Size } from "../db/associations.js";
import { ErrorResponse } from "../utils/ErrorResponse.js";

function formatedSize(size) {
  return {
    id: size.id,
    name: size.name,
  };
}

export const getSizes = async (req, res) => {
  const sizes = await Size.findAll({ order: [["id", "ASC"]] });

  res.json(
    sizes.map((size) => {
      return formatedSize(size);
    })
  );
};

export const createSize = async (req, res) => {
  const size = await Size.create(req.body);
  res.json(formatedSize(size));
};

export const getSizeById = async (req, res) => {
  const {
    params: { id },
  } = req;
  const size = await Size.findByPk(id);
  if (!size) throw new ErrorResponse("Size not found", 404);
  res.json(formatedSize(size));
};

export const updateSize = async (req, res) => {
  const {
    params: { id },
  } = req;

  const size = await Size.findByPk(id);
  if (!size) throw new ErrorResponse("Size not found", 404);
  await size.update(req.body);
  res.json(formatedSize(size));
};

export const deleteSize = async (req, res) => {
  const {
    params: { id },
  } = req;
  const size = await Size.findByPk(id);
  if (!size) throw new ErrorResponse("Size not found", 404);
  await size.destroy();
  res.json({ message: "Size " + id + " deleted successfully" });
};
