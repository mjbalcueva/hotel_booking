import { Router } from 'express';
import {
	createRoom,
	deleteRoom,
	editRoom,
	getRoomById,
	getRooms,
} from '../controllers/roomsController.js';

const roomsRouter = Router();

roomsRouter.post('/', createRoom);
roomsRouter.get('/', getRooms);
roomsRouter.get('/:id', getRoomById);
roomsRouter.delete('/:id', deleteRoom);
roomsRouter.patch('/:id', editRoom);

export { roomsRouter };
