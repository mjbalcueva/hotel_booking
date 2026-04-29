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

export { processCreateGuest };
