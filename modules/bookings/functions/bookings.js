import axios from 'axios';
import moment from 'moment';
import { db } from '../../../includes/db/db.js';

const WEATHER_LOCATION = {
	name: 'Manila',
	latitude: 14.5995,
	longitude: 120.9842,
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
				timezone: 'UTC',
				start_date: forecastDate,
				end_date: forecastDate,
			},
		});

		const daily = response.data?.daily;
		if (!daily?.time?.length) {
			return null;
		}

		return {
			location: WEATHER_LOCATION.name,
			date: daily.time[0],
			weather_code: daily.weather_code?.[0] ?? null,
			temperature_2m_max: daily.temperature_2m_max?.[0] ?? null,
			temperature_2m_min: daily.temperature_2m_min?.[0] ?? null,
			precipitation_sum: daily.precipitation_sum?.[0] ?? null,
		};
	} catch {
		return null;
	}
};

const processCreateBooking = async ({
	guest_id,
	room_id,
	check_in_date,
	check_out_date,
}) => {
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

	return { success: true, data: result.rows[0] };
};

const processGetBookings = async () => {
	const result = await db.query('SELECT * FROM bookings ORDER BY id ASC');
	return { success: true, data: result.rows };
};

const processGetBookingById = async (id) => {
	const result = await db.query('SELECT * FROM bookings WHERE id = $1', [id]);
	if (!result.rows[0]) {
		throw new Error('Booking not found');
	}
	return { success: true, data: result.rows[0] };
};

const processGetBookingsByGuestId = async (guestId) => {
	const result = await db.query(
		'SELECT * FROM bookings WHERE guest_id = $1 ORDER BY id ASC',
		[guestId],
	);
	return { success: true, data: result.rows };
};

export {
	processCreateBooking,
	processGetBookings,
	processGetBookingById,
	processGetBookingsByGuestId,
	fetchBookingWeather,
};
