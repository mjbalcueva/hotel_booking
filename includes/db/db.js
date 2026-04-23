import pg from 'pg';
import { DATABASE_URL } from '../config/mainConfig.js';

const { Pool } = pg;

const db = new Pool({
	connectionString: DATABASE_URL,
});

export { db };
