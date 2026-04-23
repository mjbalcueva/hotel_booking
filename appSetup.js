import express from 'express';
import { bookingsRouter } from './routers/bookingsRouter.js';

const app = express();

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
	res.send('Hello World');
});

app.use('/bookings', bookingsRouter);

export { app };
