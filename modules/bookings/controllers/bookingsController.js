import {
	processCreateBooking,
	processGetBookingById,
	processGetBookings,
	processGetBookingsByGuestId,
} from '../functions/bookings.js';
import { validateCreateBookingRequest } from './validations/bookingRequest.js';

const createBooking = async (req, res) => {
	try {
		const { guest_id, room_id, check_in_date, check_out_date } =
			await validateCreateBookingRequest(req.body);
		const result = await processCreateBooking({
			guest_id,
			room_id,
			check_in_date,
			check_out_date,
		});
		return res.status(200).send({ ...result });
	} catch (err) {
		return res.status(400).send({ success: false, error: err.message });
	}
};

const getBookings = async (req, res) => {
	try {
		const result = await processGetBookings();
		return res.status(200).send({ ...result });
	} catch (err) {
		return res.status(400).send({ success: false, error: err.message });
	}
};

const getBookingById = async (req, res) => {
	try {
		const id = Number(req.params.id);
		const result = await processGetBookingById(id);
		return res.status(200).send({ ...result });
	} catch (err) {
		return res.status(400).send({ success: false, error: err.message });
	}
};

const getBookingsByGuestId = async (req, res) => {
	try {
		const guestId = Number(req.params.guest_id);
		const result = await processGetBookingsByGuestId(guestId);
		return res.status(200).send({ ...result });
	} catch (err) {
		return res.status(400).send({ success: false, error: err.message });
	}
};

export { createBooking, getBookings, getBookingById, getBookingsByGuestId };
