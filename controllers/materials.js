import { Material } from "../db/associations.js";
import { ErrorResponse } from "../utils/ErrorResponse.js";

function formatedMaterial(material) {
  return {
    id: material.id,
    name: material.name,
    image: material.image,
  };
}

export const getMaterials = async (req, res) => {
  const materials = await Material.findAll({ order: [["id", "ASC"]] });

  res.json(
    materials.map((category) => {
      return formatedMaterial(category);
    })
  );
};

export const createMaterial = async (req, res) => {
  const { name } = req.body;

  const materialExists = await Material.findOne({ where: { name } });
  if (materialExists) throw new ErrorResponse("Material with this name already exists", 400);

  const material = await Material.create(req.body);
  res.json(formatedMaterial(material));
};

export const getMaterialById = async (req, res) => {
  const {
    params: { id },
  } = req;

  const material = await Material.findByPk(id);
  if (!material) throw new ErrorResponse("Material not found", 404);
  res.json(formatedMaterial(material));
};

export const updateMaterial = async (req, res) => {
  const {
    params: { id },
    body: { name },
  } = req;

  const material = await Material.findByPk(id);
  if (!material) throw new ErrorResponse("Material not found", 404);

  const nameExists = await Material.findOne({ where: { name } });
  if (nameExists) throw new ErrorResponse("Material with this name already exists", 400);

  await material.update(req.body);
  res.json(formatedMaterial(material));
};

export const deleteMaterial = async (req, res) => {
  const {
    params: { id },
  } = req;
  const material = await Material.findByPk(id);
  if (!material) throw new ErrorResponse("Material not found", 404);
  await material.destroy();
  res.json({ message: "Material " + id + " deleted successfully" });
};
