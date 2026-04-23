import { jest } from '@jest/globals';

jest.unstable_mockModule('../../../includes/db/db.js', () => ({
	db: { query: jest.fn() },
}));

const { db } = await import('../../../includes/db/db.js');
const { processCreateRoom } = await import('../functions/rooms.js');

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
});
