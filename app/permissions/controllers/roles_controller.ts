import type { HttpContext } from '@adonisjs/core/http';
import { Acl, Permission } from '@holoyan/adonisjs-permissions';

import Role from '../models/role.ts';
import roleService from '../services/role_service.ts';
import PermissionTransformer from '../transformers/permission_transformer.ts';
import RoleTransformer from '../transformers/role_transformer.ts';
import { createRoleValidator } from '../validators/roles.ts';

const SYSTEM_ROLE_ORDER = ['viewer', 'translator', 'reviewer', 'developer', 'manager'];

export default class RolesController {
	async index({ inertia }: HttpContext) {
		const roles = await Role.query().whereNot('slug', 'admin').orderBy('isSystem', 'desc').orderBy('title', 'asc');

		roles.sort((a, b) => {
			if (!a.isSystem || !b.isSystem) {
				return 0;
			}

			return SYSTEM_ROLE_ORDER.indexOf(a.slug) - SYSTEM_ROLE_ORDER.indexOf(b.slug);
		});

		const rolesWithPermissions = await Promise.all(
			roles.map(async (role) => ({ role, permissions: await Acl.role(role).permissions() })),
		);

		return inertia.render('admin/roles/index', {
			roles: RoleTransformer.transform(rolesWithPermissions),
		});
	}

	async create({ inertia }: HttpContext) {
		const permissions = await Permission.query().orderBy('slug', 'asc');

		return inertia.modal(
			'admin/roles/create',
			{ permissions: PermissionTransformer.transform(permissions) },
			{ route: 'admin.roles.index' },
		);
	}

	async store({ request, response, session }: HttpContext) {
		const data = await request.validateUsing(createRoleValidator);

		await roleService.createRole({
			name: data.name,
			description: data.description ?? null,
			permissions: data.permissions,
		});

		session.flash('success', 'Role created');

		return response.redirect().toRoute('admin.roles.index');
	}

	async destroy({ params, response, session }: HttpContext) {
		const role = await Role.findByOrFail('slug', params.slug);

		if (role.isSystem) {
			return response.abort({ message: 'Default roles cannot be deleted' }, 403);
		}

		await roleService.deleteRole(role);

		session.flash('success', 'Role deleted');

		return response.redirect().toRoute('admin.roles.index');
	}
}
