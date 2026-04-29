import { processCreateBooking } from '../functions/bookings.js';
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

export { createBooking };
