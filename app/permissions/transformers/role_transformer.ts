import { BaseTransformer } from '@adonisjs/core/transformers';
import type { PermissionInterface } from '@holoyan/adonisjs-permissions/types';

import type Role from '../models/role.ts';
import PermissionTransformer from './permission_transformer.ts';

export interface RoleWithPermissions {
	role: Role;
	permissions: PermissionInterface[];
}

export default class RoleTransformer extends BaseTransformer<RoleWithPermissions> {
	toObject() {
		return {
			...this.pick(this.resource.role, ['id', 'slug', 'title', 'description', 'isSystem', 'createdAt', 'updatedAt']),
			permissions: PermissionTransformer.transform(this.resource.permissions),
		};
	}
}
