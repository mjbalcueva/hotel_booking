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

const processDeleteRoom = async (id) => {
	const result = await db.query('DELETE FROM rooms WHERE id = $1 RETURNING *', [
		id,
	]);
	if (!result.rows[0]) {
		throw new Error('Room not found');
	}
	return { success: true, data: result.rows[0] };
};

const processEditRoom = async (
	id,
	{ room_number, room_type, price_per_night },
) => {
	const updates = [];
	const values = [];

	if (room_number !== undefined) {
		values.push(room_number);
		updates.push(`room_number = $${values.length}`);
	}

	if (room_type !== undefined) {
		values.push(room_type);
		updates.push(`room_type = $${values.length}`);
	}

	if (price_per_night !== undefined) {
		values.push(price_per_night);
		updates.push(`price_per_night = $${values.length}`);
	}

	if (!updates.length) {
		throw new Error('No room fields provided');
	}

	values.push(id);
	const result = await db.query(
		`UPDATE rooms
		 SET ${updates.join(', ')}
		 WHERE id = $${values.length}
		 RETURNING *`,
		values,
	);

	if (!result.rows[0]) {
		throw new Error('Room not found');
	}

	return { success: true, data: result.rows[0] };
};

export {
	processCreateRoom,
	processGetRooms,
	processGetRoomById,
	processDeleteRoom,
	processEditRoom,
};
