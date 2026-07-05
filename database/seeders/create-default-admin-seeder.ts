import { BaseSeeder } from '@adonisjs/lucid/seeders';
import { Acl } from '@holoyan/adonisjs-permissions';

import User from '#models/user';
import env from '#start/env';

export default class CreateDefaultAdminSeeder extends BaseSeeder {
	async run() {
		const admin = await User.create({
			email: env.get('DEFAULT_ADMIN_EMAIL'),
			password: env.get('DEFAULT_ADMIN_PASSWORD'),
			name: 'Admin',
		});

		await Acl.role().create({
			slug: 'admin',
		});
		await Acl.model(admin).assignRole('admin');
	}
}
