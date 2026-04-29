import { Router } from 'express';
import {
	createBooking,
	deleteBooking,
	editBooking,
	getBookingById,
	getBookings,
	getBookingsByGuestId,
} from '../modules/bookings/controllers/bookingsController.js';
import { guestsRouter } from '../modules/bookings/routers/guestsRouter.js';
import { roomsRouter } from '../modules/bookings/routers/roomsRouter.js';

const bookingsRouter = Router();

bookingsRouter.post('/', createBooking);
bookingsRouter.get('/', getBookings);
bookingsRouter.get('/guest/:guest_id', getBookingsByGuestId);
bookingsRouter.use('/rooms', roomsRouter);
bookingsRouter.use('/guests', guestsRouter);
bookingsRouter.get('/:id', getBookingById);
bookingsRouter.delete('/:id', deleteBooking);
bookingsRouter.patch('/:id', editBooking);

export { bookingsRouter };
