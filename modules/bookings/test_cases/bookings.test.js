import { jest } from '@jest/globals';

jest.unstable_mockModule('../../../includes/db/db.js', () => ({
	db: { query: jest.fn() },
}));

const { db } = await import('../../../includes/db/db.js');
const { processCreateRoom, processGetRoomById, processGetRooms } =
	await import('../functions/rooms.js');

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
});
