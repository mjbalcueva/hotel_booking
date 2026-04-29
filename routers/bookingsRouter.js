import { Router } from 'express';
import { guestsRouter } from '../modules/bookings/routers/guestsRouter.js';
import { roomsRouter } from '../modules/bookings/routers/roomsRouter.js';

const bookingsRouter = Router();

bookingsRouter.use('/rooms', roomsRouter);
bookingsRouter.use('/guests', guestsRouter);

export { bookingsRouter };
