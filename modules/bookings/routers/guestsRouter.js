import { Router } from 'express';
import {
	createGuest,
	getGuestById,
	getGuests,
} from '../controllers/guestsController.js';

const guestsRouter = Router();

guestsRouter.post('/', createGuest);
guestsRouter.get('/', getGuests);
guestsRouter.get('/:id', getGuestById);

export { guestsRouter };
