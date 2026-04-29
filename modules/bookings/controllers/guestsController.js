import {
	processCreateGuest,
	processGetGuestById,
	processGetGuests,
} from '../functions/guests.js';
import { validateCreateGuestRequest } from './validations/guestRequest.js';

const createGuest = async (req, res) => {
	try {
		const { first_name, last_name, email, phone } =
			await validateCreateGuestRequest(req.body);
		const result = await processCreateGuest({
			first_name,
			last_name,
			email,
			phone,
		});
		return res.status(200).send({ ...result });
	} catch (err) {
		return res.status(400).send({ success: false, error: err.message });
	}
};

const getGuests = async (req, res) => {
	try {
		const result = await processGetGuests();
		return res.status(200).send({ ...result });
	} catch (err) {
		return res.status(400).send({ success: false, error: err.message });
	}
};

const getGuestById = async (req, res) => {
	try {
		const id = Number(req.params.id);
		const result = await processGetGuestById(id);
		return res.status(200).send({ ...result });
	} catch (err) {
		return res.status(400).send({ success: false, error: err.message });
	}
};

export { createGuest, getGuests, getGuestById };
