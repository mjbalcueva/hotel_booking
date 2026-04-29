import { Router } from 'express';
import { createBooking } from '../modules/bookings/controllers/bookingsController.js';
import { guestsRouter } from '../modules/bookings/routers/guestsRouter.js';
import { roomsRouter } from '../modules/bookings/routers/roomsRouter.js';

const bookingsRouter = Router();

bookingsRouter.post('/', createBooking);
bookingsRouter.use('/rooms', roomsRouter);
bookingsRouter.use('/guests', guestsRouter);

export { bookingsRouter };
