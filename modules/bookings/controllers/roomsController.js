import {
	processCreateRoom,
	processGetRoomById,
	processGetRooms,
} from '../functions/rooms.js';

const createRoom = async (req, res) => {
	try {
		const { room_number, room_type, price_per_night } = req.body;
		const result = await processCreateRoom({
			room_number,
			room_type,
			price_per_night,
		});
		return res.status(200).send({ ...result });
	} catch (err) {
		return res.status(400).send({ success: false, error: err.message });
	}
};

const getRooms = async (req, res) => {
	try {
		const result = await processGetRooms();
		return res.status(200).send({ ...result });
	} catch (err) {
		return res.status(400).send({ success: false, error: err.message });
	}
};

const getRoomById = async (req, res) => {
	try {
		const id = Number(req.params.id);
		const result = await processGetRoomById(id);
		return res.status(200).send({ ...result });
	} catch (err) {
		return res.status(400).send({ success: false, error: err.message });
	}
};

export { createRoom, getRooms, getRoomById };
