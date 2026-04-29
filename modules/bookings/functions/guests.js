import { db } from '../../../includes/db/db.js';

const processCreateGuest = async ({ first_name, last_name, email, phone }) => {
	const result = await db.query(
		`INSERT INTO guests (first_name, last_name, email, phone)
		 VALUES ($1, $2, $3, $4)
		 RETURNING *`,
		[first_name, last_name, email, phone],
	);
	return { success: true, data: result.rows[0] };
};

const processGetGuests = async () => {
	const result = await db.query('SELECT * FROM guests ORDER BY id ASC');
	return { success: true, data: result.rows };
};

const processGetGuestById = async (id) => {
	const result = await db.query('SELECT * FROM guests WHERE id = $1', [id]);
	if (!result.rows[0]) {
		throw new Error('Guest not found');
	}
	return { success: true, data: result.rows[0] };
};

export { processCreateGuest, processGetGuests, processGetGuestById };
