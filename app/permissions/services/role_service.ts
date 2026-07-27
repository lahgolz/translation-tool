import string from '@adonisjs/core/helpers/string';
import { Acl, Permission } from '@holoyan/adonisjs-permissions';

import Role from '../models/role.ts';

export class RoleService {
	async createRole(data: { name: string; description: string | null; permissions: string[] }) {
		const slug = await this.generateUniqueSlug(data.name);
		const validPermissions = await Permission.query().whereIn('slug', data.permissions).select('slug');
		const created = await Acl.role().create({ slug, title: data.name });

		await Role.query().where('id', created.id).update({ description: data.description, isSystem: false });

		if (validPermissions.length > 0) {
			await Acl.role(created).sync(validPermissions.map((permission) => permission.slug));
		}

		return created;
	}

	async deleteRole(role: Role) {
		await Acl.role(role).flush();
		await Acl.role().delete(role.slug);
	}

	private async generateUniqueSlug(name: string) {
		const base = string.slug(name).toLowerCase();
		let slug = base;
		let suffix = 2;

		while (await Role.findBy('slug', slug)) {
			slug = `${base}-${suffix}`;
			suffix += 1;
		}

		return slug;
	}
}

export default new RoleService();
