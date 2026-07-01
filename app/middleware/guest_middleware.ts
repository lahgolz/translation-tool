import type { HttpContext } from '@adonisjs/core/http';
import type { NextFn } from '@adonisjs/core/types/http';
import type { Authenticators } from '@adonisjs/auth/types';

/**
 * Guest middleware is used to deny access to routes that should
 * be accessed by unauthenticated users.
 *
 * For example, the login page should not be accessible if the user
 * is already logged-in
 */
export default class GuestMiddleware {
	/**
	 * The URL to redirect to when user is logged-in
	 */
	redirectTo = '/';

	async handle(context: HttpContext, next: NextFn, options: { guards?: (keyof Authenticators)[] } = {}) {
		const { auth, session, response } = context;

		for (const guard of options.guards ?? [auth.defaultGuard]) {
			const guardCheck = await auth.use(guard).check();

			if (!guardCheck) {
				continue;
			}

			session.reflash();
			response.redirect(this.redirectTo, true);

			return;
		}

		// oxlint-disable-next-line typescript/consistent-return
		return next();
	}
}
