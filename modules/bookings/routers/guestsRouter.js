import { Router } from 'express';
import { createGuest } from '../controllers/guestsController.js';

const guestsRouter = Router();

guestsRouter.post('/', createGuest);

export { guestsRouter };
