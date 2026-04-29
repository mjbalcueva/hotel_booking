import { Router } from 'express';
import {
	createGuest,
	editGuest,
	getGuestById,
	getGuests,
} from '../controllers/guestsController.js';

const guestsRouter = Router();

guestsRouter.post('/', createGuest);
guestsRouter.get('/', getGuests);
guestsRouter.get('/:id', getGuestById);
guestsRouter.patch('/:id', editGuest);

export { guestsRouter };
