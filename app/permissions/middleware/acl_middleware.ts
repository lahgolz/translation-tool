import type { HttpContext } from '@adonisjs/core/http';
import type { NextFn } from '@adonisjs/core/types/http';
import { AclManager } from '@holoyan/adonisjs-permissions';

declare module '@adonisjs/core/http' {
	export interface HttpContext {
		acl: AclManager;
	}
}

export default class AclMiddleware {
	async handle(context: HttpContext, next: NextFn, permission: string) {
		const user = context.auth.user;
		const isAdmin = await user?.hasRole('admin');
		const hasPermission = await user?.hasPermission(permission);

		if (!isAdmin && !hasPermission) {
			return context.response.abort({ message: 'Forbidden' }, 403);
		}

		return next();
	}
}
