import { BaseSeeder } from '@adonisjs/lucid/seeders';

import User from '#models/user';
import env from '#start/env';

export default class CreateDefaultAdminSeeder extends BaseSeeder {
	async run() {
		await User.create({
			email: env.get('DEFAULT_ADMIN_EMAIL'),
			password: env.get('DEFAULT_ADMIN_PASSWORD'),
			name: 'Admin',
		});
	}
}
