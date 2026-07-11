import { BaseSeeder } from '@adonisjs/lucid/seeders';
import { Acl } from '@holoyan/adonisjs-permissions';

import env from '#start/env';
import User from '#users/models/user';

export default class CreateAdminSeeder extends BaseSeeder {
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
