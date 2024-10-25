import { Style } from "../db/associations.js";
import { ErrorResponse } from "../utils/ErrorResponse.js";

function formatedStyle(style) {
  return {
    id: style.id,
    name: style.name,
    image: style.image,
  };
}

export const getStyles = async (req, res) => {
  const styles = await Style.findAll({ order: [["id", "ASC"]] });

  res.json(
    styles.map((style) => {
      return formatedStyle(style);
    })
  );
};

export const createStyle = async (req, res) => {
  const { name } = req.body;

  const styleExists = await Style.findOne({ where: { name } });
  if (styleExists) throw new ErrorResponse("Style with this name already exists", 400);

  const style = await Style.create(req.body);
  res.json(formatedStyle(style));
};

export const getStyleById = async (req, res) => {
  const {
    params: { id },
  } = req;

  const style = await Style.findByPk(id);
  if (!style) throw new ErrorResponse("Style not found", 404);
  res.json(formatedStyle(style));
};

export const updateStyle = async (req, res) => {
  const {
    params: { id },
    body: { name },
  } = req;

  const style = await Style.findByPk(id);
  if (!style) throw new ErrorResponse("Style not found", 404);

  // const styleNameExists = await Style.findOne({ where: { name } });
  // if (styleNameExists) throw new ErrorResponse("Style with this name already exists", 400);

  await style.update(req.body);
  res.json(formatedStyle(style));
};

export const deleteStyle = async (req, res) => {
  const {
    params: { id },
  } = req;
  const style = await Style.findByPk(id);
  if (!style) throw new ErrorResponse("Style not found", 404);
  await style.destroy();
  res.json({ message: "Style " + id + " deleted successfully" });
};
