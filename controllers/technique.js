import { Technique } from "../db/associations.js";
import { ErrorResponse } from "../utils/ErrorResponse.js";

function formatedTechnique(technique) {
  return {
    id: technique.id,
    name: technique.name,
    image: technique.image,
  };
}

export const getTechniques = async (req, res) => {
  const techniques = await Technique.findAll({ order: [["id", "ASC"]] });

  res.json(
    techniques.map((technique) => {
      return formatedTechnique(technique);
    })
  );
};

export const createTechnique = async (req, res) => {
  const { name } = req.body;

  const techniqueExists = await Technique.findOne({ where: { name } });
  if (techniqueExists) throw new ErrorResponse("Technique with this name already exists", 400);

  const technique = await Technique.create(req.body);
  res.json(formatedTechnique(technique));
};

export const getTechniqueById = async (req, res) => {
  const {
    params: { id },
  } = req;

  const technique = await Technique.findByPk(id);
  if (!technique) throw new ErrorResponse("Technique not found", 404);
  res.json(formatedTechnique(technique));
};

export const updateTechnique = async (req, res) => {
  const {
    params: { id },
    body: { name },
  } = req;

  const technique = await Technique.findByPk(id);
  if (!technique) throw new ErrorResponse("Technique not found", 404);

  // const techniqueNameExists = await Technique.findOne({ where: { name } });
  // if (techniqueNameExists) throw new ErrorResponse("Technique with this name already exists", 400);

  await technique.update(req.body);
  res.json(formatedTechnique(technique));
};

export const deleteTechnique = async (req, res) => {
  const {
    params: { id },
  } = req;
  const technique = await Technique.findByPk(id);
  if (!technique) throw new ErrorResponse("Technique not found", 404);
  await technique.destroy();
  res.json({ message: "Technique " + id + " deleted successfully" });
};
