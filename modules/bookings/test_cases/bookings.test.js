import { jest } from '@jest/globals';

jest.unstable_mockModule('../../../includes/db/db.js', () => ({
	db: { query: jest.fn() },
}));

const { db } = await import('../../../includes/db/db.js');
const {
	processCreateGuest,
	processEditGuest,
	processGetGuestById,
	processGetGuests,
} = await import('../functions/guests.js');
const {
	processCreateRoom,
	processDeleteRoom,
	processEditRoom,
	processGetRoomById,
	processGetRooms,
} = await import('../functions/rooms.js');
const { validateCreateGuestRequest, validateEditGuestRequest } =
	await import('../controllers/validations/guestRequest.js');
const { validateCreateRoomRequest, validateEditRoomRequest } =
	await import('../controllers/validations/roomRequest.js');

describe('Room Management', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	it('should create a room successfully', async () => {
		db.query.mockResolvedValueOnce({
			rows: [
				{
					id: 1,
					room_number: '101',
					room_type: 'double',
					price_per_night: 150.0,
				},
			],
		});

		const result = await processCreateRoom({
			room_number: '101',
			room_type: 'double',
			price_per_night: 150.0,
		});

		expect(result.success).toBe(true);
		expect(db.query).toHaveBeenCalled();
	});

	it('should fetch all rooms successfully', async () => {
		db.query.mockResolvedValueOnce({
			rows: [
				{
					id: 1,
					room_number: '101',
					room_type: 'single',
					price_per_night: 100.0,
				},
				{
					id: 2,
					room_number: '102',
					room_type: 'double',
					price_per_night: 150.0,
				},
			],
		});

		const result = await processGetRooms();

		expect(result.success).toBe(true);
		expect(result.data).toHaveLength(2);
		expect(db.query).toHaveBeenCalledWith(
			'SELECT * FROM rooms ORDER BY id ASC',
		);
	});

	it('should fetch one room by id successfully', async () => {
		db.query.mockResolvedValueOnce({
			rows: [
				{
					id: 1,
					room_number: '101',
					room_type: 'single',
					price_per_night: 100.0,
				},
			],
		});

		const result = await processGetRoomById(1);

		expect(result.success).toBe(true);
		expect(result.data.id).toBe(1);
		expect(db.query).toHaveBeenCalledWith(
			'SELECT * FROM rooms WHERE id = $1',
			[1],
		);
	});

	it('should throw when room id does not exist', async () => {
		db.query.mockResolvedValueOnce({ rows: [] });

		await expect(processGetRoomById(999)).rejects.toThrow('Room not found');
	});

	it('should delete one room successfully', async () => {
		db.query.mockResolvedValueOnce({
			rows: [
				{
					id: 1,
					room_number: '101',
					room_type: 'single',
					price_per_night: 100.0,
				},
			],
		});

		const result = await processDeleteRoom(1);

		expect(result.success).toBe(true);
		expect(result.data.id).toBe(1);
		expect(db.query).toHaveBeenCalledWith(
			'DELETE FROM rooms WHERE id = $1 RETURNING *',
			[1],
		);
	});

	it('should throw when deleting missing room', async () => {
		db.query.mockResolvedValueOnce({ rows: [] });

		await expect(processDeleteRoom(999)).rejects.toThrow('Room not found');
	});

	it('should edit one room successfully', async () => {
		db.query.mockResolvedValueOnce({
			rows: [
				{
					id: 1,
					room_number: '201',
					room_type: 'suite',
					price_per_night: 275.0,
				},
			],
		});

		const result = await processEditRoom(1, {
			room_number: '201',
			room_type: 'suite',
			price_per_night: 275.0,
		});

		expect(result.success).toBe(true);
		expect(result.data.room_number).toBe('201');
		expect(db.query).toHaveBeenCalledWith(
			`UPDATE rooms
		 SET room_number = $1, room_type = $2, price_per_night = $3
		 WHERE id = $4
		 RETURNING *`,
			['201', 'suite', 275.0, 1],
		);
	});

	it('should throw when editing missing room', async () => {
		db.query.mockResolvedValueOnce({ rows: [] });

		await expect(
			processEditRoom(999, {
				room_type: 'suite',
			}),
		).rejects.toThrow('Room not found');
	});
});

describe('Room Validation', () => {
	it('should reject room creation with missing required fields', async () => {
		await expect(
			validateCreateRoomRequest({
				room_number: '101',
			}),
		).rejects.toThrow();
	});

	it('should reject room edit with invalid price', async () => {
		await expect(
			validateEditRoomRequest({
				price_per_night: -1,
			}),
		).rejects.toThrow();
	});
});

describe('Guest Management', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	it('should create a guest successfully', async () => {
		db.query.mockResolvedValueOnce({
			rows: [
				{
					id: 1,
					first_name: 'Bruce',
					last_name: 'Wayne',
					email: 'bruce@example.com',
					phone: '555-0101',
				},
			],
		});

		const result = await processCreateGuest({
			first_name: 'Bruce',
			last_name: 'Wayne',
			email: 'bruce@example.com',
			phone: '555-0101',
		});

		expect(result.success).toBe(true);
		expect(result.data.email).toBe('bruce@example.com');
		expect(db.query).toHaveBeenCalledWith(
			`INSERT INTO guests (first_name, last_name, email, phone)
		 VALUES ($1, $2, $3, $4)
		 RETURNING *`,
			['Bruce', 'Wayne', 'bruce@example.com', '555-0101'],
		);
	});

	it('should fetch all guests successfully', async () => {
		db.query.mockResolvedValueOnce({
			rows: [
				{
					id: 1,
					first_name: 'Bruce',
					last_name: 'Wayne',
					email: 'bruce@example.com',
					phone: '555-0101',
				},
				{
					id: 2,
					first_name: 'Selina',
					last_name: 'Kyle',
					email: 'selina@example.com',
					phone: '555-0102',
				},
			],
		});

		const result = await processGetGuests();

		expect(result.success).toBe(true);
		expect(result.data).toHaveLength(2);
		expect(db.query).toHaveBeenCalledWith(
			'SELECT * FROM guests ORDER BY id ASC',
		);
	});

	it('should fetch one guest by id successfully', async () => {
		db.query.mockResolvedValueOnce({
			rows: [
				{
					id: 1,
					first_name: 'Bruce',
					last_name: 'Wayne',
					email: 'bruce@example.com',
					phone: '555-0101',
				},
			],
		});

		const result = await processGetGuestById(1);

		expect(result.success).toBe(true);
		expect(result.data.id).toBe(1);
		expect(db.query).toHaveBeenCalledWith(
			'SELECT * FROM guests WHERE id = $1',
			[1],
		);
	});

	it('should throw when guest id does not exist', async () => {
		db.query.mockResolvedValueOnce({ rows: [] });

		await expect(processGetGuestById(999)).rejects.toThrow('Guest not found');
	});

	it('should edit one guest successfully', async () => {
		db.query.mockResolvedValueOnce({
			rows: [
				{
					id: 1,
					first_name: 'Bruce',
					last_name: 'Wayne',
					email: 'batman@example.com',
					phone: '555-0199',
				},
			],
		});

		const result = await processEditGuest(1, {
			first_name: 'Bruce',
			last_name: 'Wayne',
			email: 'batman@example.com',
			phone: '555-0199',
		});

		expect(result.success).toBe(true);
		expect(result.data.email).toBe('batman@example.com');
		expect(db.query).toHaveBeenCalledWith(
			`UPDATE guests
		 SET first_name = $1, last_name = $2, email = $3, phone = $4
		 WHERE id = $5
		 RETURNING *`,
			['Bruce', 'Wayne', 'batman@example.com', '555-0199', 1],
		);
	});

	it('should throw when editing missing guest', async () => {
		db.query.mockResolvedValueOnce({ rows: [] });

		await expect(
			processEditGuest(999, {
				email: 'missing@example.com',
			}),
		).rejects.toThrow('Guest not found');
	});
});

describe('Guest Validation', () => {
	it('should reject guest creation with invalid email', async () => {
		await expect(
			validateCreateGuestRequest({
				first_name: 'Bruce',
				last_name: 'Wayne',
				email: 'not-an-email',
				phone: '555-0101',
			}),
		).rejects.toThrow();
	});

	it('should reject guest edit with invalid email', async () => {
		await expect(
			validateEditGuestRequest({
				email: 'not-an-email',
			}),
		).rejects.toThrow();
	});
});
