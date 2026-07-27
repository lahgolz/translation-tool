import { BaseSeeder } from '@adonisjs/lucid/seeders';
import { Acl } from '@holoyan/adonisjs-permissions';

import Role from '#permissions/models/role';

const PERMISSIONS = [
	{ slug: 'project.view', title: 'View projects' },
	{ slug: 'project.manage', title: 'Manage projects' },
	{ slug: 'members.manage', title: 'Manage global membership' },
] as const;

const DEFAULT_ROLES = [
	{
		slug: 'viewer',
		title: 'Viewer',
		description: 'View source items and translations.',
		permissions: ['project.view'],
	},
	{
		slug: 'translator',
		title: 'Translator',
		description: 'Edit assigned target-language translations.',
		permissions: ['project.view'],
	},
	{
		slug: 'reviewer',
		title: 'Reviewer',
		description: 'Review translations and approve change requests.',
		permissions: ['project.view'],
	},
	{
		slug: 'developer',
		title: 'Developer',
		description: 'Manage keys, imports, exports, archive, and draft promotion.',
		permissions: ['project.view'],
	},
	{
		slug: 'manager',
		title: 'Manager',
		description: 'Manage projects, members, global assets, tasks, and workflows.',
		permissions: ['project.view', 'project.manage', 'members.manage'],
	},
] as const;

export default class CreateDefaultRolesSeeder extends BaseSeeder {
	async run() {
		for (const permission of PERMISSIONS) {
			await Acl.permission().create(permission);
		}

		for (const role of DEFAULT_ROLES) {
			const created = await Acl.role().create({ slug: role.slug, title: role.title });

			await Role.query().where('id', created.id).update({ description: role.description, isSystem: true });
			await Acl.role(created).sync([...role.permissions]);
		}

		await Role.query().where('slug', 'admin').update({
			title: 'Admin',
			description: 'Full administrative access. Bypasses all permission checks.',
			isSystem: true,
		});
	}
}
