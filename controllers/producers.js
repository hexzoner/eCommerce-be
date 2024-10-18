import { ErrorResponse } from "../utils/ErrorResponse.js";
import Producer from "../models/Producer.js";

export const getProducers = async (req, res) => {
  const producers = await Producer.findAll({ order: [["id", "ASC"]] });
  res.json(producers);
};

export const getProducerById = async (req, res) => {
  const {
    params: { id },
  } = req;
  const producer = await Producer.findByPk(id);
  if (!producer) throw new ErrorResponse("Producer not found", 404);
  res.json(producer);
};

export const createProducer = async (req, res) => {
  const producer = await Producer.create(req.body);
  res.json(producer);
};

export const updateProducer = async (req, res) => {
  const {
    params: { id },
  } = req;

  const producer = await Producer.findByPk(id);
  if (!producer) throw new ErrorResponse("Producer not found", 404);
  await producer.update(req.body);
  res.json(producer);
};

export const deleteProducer = async (req, res) => {
  const {
    params: { id },
  } = req;
  const producer = await Producer.findByPk(id);
  if (!producer) throw new ErrorResponse("Producer not found", 404);
  await producer.destroy();
  res.json({ message: "Producer " + id + " deleted successfully" });
};
