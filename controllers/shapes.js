import { Shape } from "../db/associations.js";
import { ErrorResponse } from "../utils/ErrorResponse.js";

function formatedShape(shape) {
  return {
    id: shape.id,
    name: shape.name,
    image: shape.image,
  };
}

export const getShapes = async (req, res) => {
  const shapes = await Shape.findAll({ order: [["id", "ASC"]] });

  res.json(
    shapes.map((shape) => {
      return formatedShape(shape);
    })
  );
};

export const createShape = async (req, res) => {
  const { name } = req.body;

  const shapeExists = await Shape.findOne({ where: { name } });
  if (shapeExists) throw new ErrorResponse("Shape with this name already exists", 400);

  const shape = await Shape.create(req.body);
  res.json(formatedShape(shape));
};

export const getShapeById = async (req, res) => {
  const {
    params: { id },
  } = req;

  const shape = await Shape.findByPk(id);
  if (!shape) throw new ErrorResponse("Shape not found", 404);
  res.json(formatedShape(shape));
};

export const updateShape = async (req, res) => {
  const {
    params: { id },
    body: { name },
  } = req;

  const shape = await Shape.findByPk(id);
  if (!shape) throw new ErrorResponse("Shape not found", 404);

  // const shapeNameExists = await Shape.findOne({ where: { name } });
  // if (shapeNameExists) throw new ErrorResponse("Shape with this name already exists", 400);

  await shape.update(req.body);
  res.json(formatedShape(shape));
};

export const deleteShape = async (req, res) => {
  const {
    params: { id },
  } = req;
  const shape = await Shape.findByPk(id);
  if (!shape) throw new ErrorResponse("Shape not found", 404);
  await shape.destroy();
  res.json({ message: "Shape " + id + " deleted successfully" });
};
