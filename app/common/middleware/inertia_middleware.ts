import type { HttpContext } from '@adonisjs/core/http';
import type { NextFn } from '@adonisjs/core/types/http';
import BaseInertiaMiddleware from '@adonisjs/inertia/inertia_middleware';

import UserTransformer from '#users/transformers/user_transformer';

export default class InertiaMiddleware extends BaseInertiaMiddleware {
	share(context: HttpContext) {
		/**
		 * The share method is called everytime an Inertia page is rendered. In
		 * certain cases, a page may get rendered before the session middleware
		 * or the auth middleware are executed. For example: During a 404 request.
		 *
		 * In that case, we must always assume that HttpContext is not fully hydrated
		 * with all the properties
		 */
		const { session, auth } = context as Partial<HttpContext>;
		const { inertia } = context;

		/**
		 * Fetching the first error from the flash messages
		 */
		const error = session?.flashMessages.get('error') as string;
		const success = session?.flashMessages.get('success') as string;

		/**
		 * Data shared with all Inertia pages. Make sure you are using
		 * transformers for rich data-types like Models.
		 */
		return {
			errors: inertia.always(this.getValidationErrors(context)),
			flash: inertia.always({
				error,
				success,
			}),
			user: inertia.always(auth?.user ? UserTransformer.transform(auth.user) : undefined),
		};
	}

	async handle(context: HttpContext, next: NextFn) {
		await this.init(context);

		const output = await next();

		this.dispose(context);

		return output;
	}
}

declare module '@adonisjs/inertia/types' {
	export interface SharedProps extends InferSharedProps<InertiaMiddleware> {}
}
