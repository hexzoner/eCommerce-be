import LatestArrival from "../models/LatestArrival.js";
import { ErrorResponse } from "../utils/ErrorResponse.js";

export const getLatestArrivals = async (req, res) => {
  const latestArrivals = await LatestArrival.findAll({ order: [["id", "ASC"]] });

  res.json(latestArrivals);
};

export const createLatestArrival = async (req, res) => {
  const latestArrival = await LatestArrival.create(req.body);
  res.json(latestArrival);
};

export const updateLatestArrival = async (req, res) => {
  const {
    params: { id },
  } = req;

  const latestArrival = await LatestArrival.findByPk(id);
  if (!latestArrival) throw new ErrorResponse("LatestArrival not found", 404);
  await latestArrival.update(req.body);
  res.json(latestArrival);
};

export const deleteLatestArrival = async (req, res) => {
  const {
    params: { id },
  } = req;
  const latestArrival = await LatestArrival.findByPk(id);
  if (!latestArrival) throw new ErrorResponse("LatestArrival not found", 404);
  await latestArrival.destroy();
  res.json({ message: "LatestArrival " + id + " deleted successfully" });
};
