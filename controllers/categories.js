import { Category } from "../db/associations.js";
import { ErrorResponse } from "../utils/ErrorResponse.js";

function formatedCategory(category) {
  return {
    id: category.id,
    name: category.name,
  };
}

export const getCategories = async (req, res) => {
  const categories = await Category.findAll({ order: [["id", "ASC"]] });

  res.json(
    categories.map((category) => {
      return formatedCategory(category);
    })
  );
};

export const createCategory = async (req, res) => {
  const category = await Category.create(req.body);
  res.json(formatedCategory(category));
};

export const getCategoryById = async (req, res) => {
  const {
    params: { id },
  } = req;
  const category = await Category.findByPk(id);
  if (!category) throw new ErrorResponse("Category not found", 404);
  res.json(formatedCategory(category));
};

export const updateCategory = async (req, res) => {
  const {
    params: { id },
  } = req;

  const category = await Category.findByPk(id);
  if (!category) throw new ErrorResponse("Category not found", 404);
  await category.update(req.body);
  res.json(formatedCategory(category));
};

export const deleteCategory = async (req, res) => {
  const {
    params: { id },
  } = req;
  const category = await Category.findByPk(id);
  if (!category) throw new ErrorResponse("Category not found", 404);
  await category.destroy();
  res.json({ message: "Category " + id + " deleted successfully" });
};
