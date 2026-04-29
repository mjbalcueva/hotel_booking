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

const processEditGuest = async (
	id,
	{ first_name, last_name, email, phone },
) => {
	const updates = [];
	const values = [];

	if (first_name !== undefined) {
		values.push(first_name);
		updates.push(`first_name = $${values.length}`);
	}

	if (last_name !== undefined) {
		values.push(last_name);
		updates.push(`last_name = $${values.length}`);
	}

	if (email !== undefined) {
		values.push(email);
		updates.push(`email = $${values.length}`);
	}

	if (phone !== undefined) {
		values.push(phone);
		updates.push(`phone = $${values.length}`);
	}

	if (!updates.length) {
		throw new Error('No guest fields provided');
	}

	values.push(id);
	const result = await db.query(
		`UPDATE guests
		 SET ${updates.join(', ')}
		 WHERE id = $${values.length}
		 RETURNING *`,
		values,
	);

	if (!result.rows[0]) {
		throw new Error('Guest not found');
	}

	return { success: true, data: result.rows[0] };
};

export {
	processCreateGuest,
	processGetGuests,
	processGetGuestById,
	processEditGuest,
};
