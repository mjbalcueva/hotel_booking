import axios from 'axios';
import moment from 'moment';
import { db } from '../../../includes/db/db.js';

const WEATHER_LOCATION = {
	name: 'Legazpi',
	address: 'Bicol Region',
	latitude: 13.1412,
	longitude: 123.7407,
};

const fetchBookingWeather = async (checkInDate) => {
	try {
		const forecastDate = moment.utc(checkInDate).format('YYYY-MM-DD');
		const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
			params: {
				latitude: WEATHER_LOCATION.latitude,
				longitude: WEATHER_LOCATION.longitude,
				daily: [
					'weather_code',
					'temperature_2m_max',
					'temperature_2m_min',
					'precipitation_sum',
				].join(','),
				timezone: 'auto',
				start_date: forecastDate,
				end_date: forecastDate,
			},
			timeout: 5000,
		});

		if (response.data?.error) {
			throw new Error(response.data.reason || 'Open-Meteo returned an error');
		}

		const daily = response.data?.daily;
		if (!daily?.time?.length) {
			return null;
		}

		return {
			source: 'open-meteo',
			location: WEATHER_LOCATION.name,
			address: WEATHER_LOCATION.address,
			latitude: WEATHER_LOCATION.latitude,
			longitude: WEATHER_LOCATION.longitude,
			timezone: response.data?.timezone ?? null,
			units: response.data?.daily_units ?? {},
			date: daily.time[0],
			weather_code: daily.weather_code?.[0] ?? null,
			temperature_2m_max: daily.temperature_2m_max?.[0] ?? null,
			temperature_2m_min: daily.temperature_2m_min?.[0] ?? null,
			precipitation_sum: daily.precipitation_sum?.[0] ?? null,
		};
	} catch (error) {
		console.error(
			'Weather API error:',
			error instanceof Error ? error.message : 'Unknown error',
		);
		return null;
	}
};

const formatBookingDate = (date) => moment(date).format('YYYY-MM-DD');

const formatBookingDates = (booking) => ({
	...booking,
	check_in_date: formatBookingDate(booking.check_in_date),
	check_out_date: formatBookingDate(booking.check_out_date),
});

const assertRoomIsAvailable = async ({
	room_id,
	check_in_date,
	check_out_date,
	excludedBookingId = null,
}) => {
	const params = [room_id, check_in_date, check_out_date];
	const excludeCurrentBooking = excludedBookingId ? 'AND id <> $4' : '';

	if (excludedBookingId) {
		params.push(excludedBookingId);
	}

	const result = await db.query(
		`SELECT id FROM bookings
		 WHERE room_id = $1
		 AND status <> 'cancelled'
		 AND check_in_date < $3
		 AND check_out_date > $2
		 ${excludeCurrentBooking}
		 LIMIT 1`,
		params,
	);

	if (result.rows[0]) {
		throw new Error('Room is already booked for these dates');
	}
};

const processCreateBooking = async ({
	guest_id,
	room_id,
	check_in_date,
	check_out_date,
}) => {
	await assertRoomIsAvailable({ room_id, check_in_date, check_out_date });

	const weatherData = await fetchBookingWeather(check_in_date);
	const result = await db.query(
		`INSERT INTO bookings (
			guest_id,
			room_id,
			check_in_date,
			check_out_date,
			weather_data
		 )
		 VALUES ($1, $2, $3, $4, $5)
		 RETURNING *`,
		[
			guest_id,
			room_id,
			check_in_date,
			check_out_date,
			weatherData ? JSON.stringify(weatherData) : null,
		],
	);

	return { success: true, data: formatBookingDates(result.rows[0]) };
};

const processGetBookings = async () => {
	const result = await db.query('SELECT * FROM bookings ORDER BY id ASC');
	return { success: true, data: result.rows.map(formatBookingDates) };
};

const processGetBookingById = async (id) => {
	const result = await db.query('SELECT * FROM bookings WHERE id = $1', [id]);
	if (!result.rows[0]) {
		throw new Error('Booking not found');
	}
	return { success: true, data: formatBookingDates(result.rows[0]) };
};

const processGetBookingsByGuestId = async (guestId) => {
	const result = await db.query(
		'SELECT * FROM bookings WHERE guest_id = $1 ORDER BY id ASC',
		[guestId],
	);
	return { success: true, data: result.rows.map(formatBookingDates) };
};

const processDeleteBooking = async (id) => {
	const result = await db.query(
		'DELETE FROM bookings WHERE id = $1 RETURNING *',
		[id],
	);
	if (!result.rows[0]) {
		throw new Error('Booking not found');
	}
	return { success: true, data: formatBookingDates(result.rows[0]) };
};

const processEditBooking = async (id, { status }) => {
	const existingBookingResult = await db.query(
		'SELECT * FROM bookings WHERE id = $1',
		[id],
	);
	if (!existingBookingResult.rows[0]) {
		throw new Error('Booking not found');
	}

	const existingBooking = formatBookingDates(existingBookingResult.rows[0]);

	if (status !== 'cancelled') {
		await assertRoomIsAvailable({
			room_id: existingBooking.room_id,
			check_in_date: existingBooking.check_in_date,
			check_out_date: existingBooking.check_out_date,
			excludedBookingId: id,
		});
	}

	const result = await db.query(
		'UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *',
		[status, id],
	);
	if (!result.rows[0]) {
		throw new Error('Booking not found');
	}
	return { success: true, data: formatBookingDates(result.rows[0]) };
};

export {
	processCreateBooking,
	processGetBookings,
	processGetBookingById,
	processGetBookingsByGuestId,
	processDeleteBooking,
	processEditBooking,
	fetchBookingWeather,
};
