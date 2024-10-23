import { Room } from "../db/associations.js";
import { ErrorResponse } from "../utils/ErrorResponse.js";

function formatedRoom(r) {
  return {
    id: r.id,
    name: r.name,
    image: r.image,
  };
}

export const getRooms = async (req, res) => {
  const rooms = await Room.findAll({ order: [["id", "ASC"]] });

  res.json(
    rooms.map((r) => {
      return formatedRoom(r);
    })
  );
};

export const createRoom = async (req, res) => {
  const { name } = req.body;

  const rExists = await Room.findOne({ where: { name } });
  if (rExists) throw new ErrorResponse("Room with this name already exists", 400);

  const r = await Room.create(req.body);
  res.json(formatedRoom(r));
};

export const getRoomById = async (req, res) => {
  const {
    params: { id },
  } = req;

  const r = await Room.findByPk(id);
  if (!r) throw new ErrorResponse("Room not found", 404);
  res.json(formatedRoom(r));
};

export const updateRoom = async (req, res) => {
  const {
    params: { id },
    // body: { name },
  } = req;

  const r = await Room.findByPk(id);
  if (!r) throw new ErrorResponse("Room not found", 404);

  // const styleNameExists = await Style.findOne({ where: { name } });
  // if (styleNameExists) throw new ErrorResponse("Style with this name already exists", 400);

  await r.update(req.body);
  res.json(formatedRoom(r));
};

export const deleteRoom = async (req, res) => {
  const {
    params: { id },
  } = req;
  const r = await Room.findByPk(id);
  if (!r) throw new ErrorResponse("Room not found", 404);
  await r.destroy();
  res.json({ message: "Room " + id + " deleted successfully" });
};
