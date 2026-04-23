import { Router } from 'express';
import { createRoom } from '../controllers/roomsController.js';

const roomsRouter = Router();

roomsRouter.post('/', createRoom);

export { roomsRouter };
