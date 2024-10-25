import { Feature } from "../db/associations.js";
import { ErrorResponse } from "../utils/ErrorResponse.js";

function formatedFeature(f) {
  return {
    id: f.id,
    name: f.name,
    image: f.image,
  };
}

export const getFeatures = async (req, res) => {
  const features = await Feature.findAll({ order: [["id", "ASC"]] });

  res.json(
    features.map((f) => {
      return formatedFeature(f);
    })
  );
};

export const createFeature = async (req, res) => {
  const { name } = req.body;

  const fExists = await Feature.findOne({ where: { name } });
  if (fExists) throw new ErrorResponse("Feature with this name already exists", 400);

  const style = await Feature.create(req.body);
  res.json(formatedFeature(style));
};

export const getFeatureById = async (req, res) => {
  const {
    params: { id },
  } = req;

  const f = await Feature.findByPk(id);
  if (!f) throw new ErrorResponse("Feature not found", 404);
  res.json(formatedFeature(f));
};

export const updateFeature = async (req, res) => {
  const {
    params: { id },
    // body: { name },
  } = req;

  const f = await Feature.findByPk(id);
  if (!f) throw new ErrorResponse("Feature not found", 404);

  // const styleNameExists = await Style.findOne({ where: { name } });
  // if (styleNameExists) throw new ErrorResponse("Style with this name already exists", 400);

  await f.update(req.body);
  res.json(formatedFeature(f));
};

export const deleteFeature = async (req, res) => {
  const {
    params: { id },
  } = req;
  const f = await Feature.findByPk(id);
  if (!f) throw new ErrorResponse("Feature not found", 404);
  await f.destroy();
  res.json({ message: "Feature " + id + " deleted successfully" });
};
