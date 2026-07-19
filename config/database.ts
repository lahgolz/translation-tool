import app from '@adonisjs/core/services/app';
import { defineConfig } from '@adonisjs/lucid';

import env from '#start/env';

const migrationsConfig = {
	/**
	 * Sort migration files naturally by filename.
	 */
	naturalSort: true,

	/**
	 * Paths containing migration files.
	 */
	paths: [
		'database/migrations',
		'app/users/database/migrations',
		'app/common/database/migrations',
		'app/permissions/database/migrations',
		'app/projects/database/migrations',
	],
};

const seedersConfig = {
	/**
	 * Paths containing seeder files.
	 */
	paths: [
		'database/seeders',
		'app/users/database/seeders',
		'app/common/database/seeders',
		'app/permissions/database/seeders',
	],
};

const dbConfig = defineConfig({
	/**
	 * Default connection used for all queries.
	 */
	connection: env.get('DB_CONNECTION'),

	connections: {
		/**
		 * SQLite connection (for tests).
		 */
		sqlite: {
			client: 'better-sqlite3',

			connection: {
				filename: app.tmpPath('db.sqlite3'),
			},

			/**
			 * Required by Knex for SQLite defaults.
			 */
			useNullAsDefault: true,

			migrations: migrationsConfig,
			seeders: seedersConfig,
			debug: app.inDev,
		},

		/**
		 * PostgreSQL connection (default).
		 */
		pg: {
			client: 'pg',

			connection: {
				host: env.get('DB_HOST'),
				port: env.get('DB_PORT'),
				user: env.get('DB_USER'),
				password: env.get('DB_PASSWORD'),
				database: env.get('DB_DATABASE'),
			},

			migrations: migrationsConfig,
			seeders: seedersConfig,
			debug: app.inDev,
		},
	},
});

export default dbConfig;
