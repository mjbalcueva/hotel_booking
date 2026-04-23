import { Router } from 'express';
import { roomsRouter } from '../modules/bookings/routers/roomsRouter.js';

const bookingsRouter = Router();

bookingsRouter.use('/rooms', roomsRouter);

export { bookingsRouter };
