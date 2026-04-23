import { db } from '../../../includes/db/db.js';

const processCreateRoom = async ({
	room_number,
	room_type,
	price_per_night,
}) => {
	const result = await db.query(
		`INSERT INTO rooms (room_number, room_type, price_per_night)
		 VALUES ($1, $2, $3)
		 RETURNING *`,
		[room_number, room_type, price_per_night],
	);
	return { success: true, data: result.rows[0] };
};

const processGetRooms = async () => {
	const result = await db.query('SELECT * FROM rooms ORDER BY id ASC');
	return { success: true, data: result.rows };
};

const processGetRoomById = async (id) => {
	const result = await db.query('SELECT * FROM rooms WHERE id = $1', [id]);
	if (!result.rows[0]) {
		throw new Error('Room not found');
	}
	return { success: true, data: result.rows[0] };
};

export { processCreateRoom, processGetRooms, processGetRoomById };
