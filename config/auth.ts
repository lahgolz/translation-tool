import { defineConfig } from '@adonisjs/auth';
import { sessionGuard, sessionUserProvider } from '@adonisjs/auth/session';
import type { InferAuthenticators, InferAuthEvents, Authenticators } from '@adonisjs/auth/types';

const authConfig = defineConfig({
	/**
	 * Default guard used when no guard is explicitly specified.
	 */
	default: 'web',

	guards: {
		/**
		 * Session-based guard for browser authentication.
		 */
		web: sessionGuard({
			/**
			 * Enable persistent login using remember-me tokens.
			 */
			useRememberMeTokens: false,

			provider: sessionUserProvider({
				model: async () => import('#users/models/user'),
			}),
		}),
	},
});

export default authConfig;

/**
 * Inferring types from the configured auth
 * guards.
 */
declare module '@adonisjs/auth/types' {
	// oxlint-disable-next-line typescript/no-empty-object-type
	export interface Authenticators extends InferAuthenticators<typeof authConfig> {}
}

declare module '@adonisjs/core/types' {
	// oxlint-disable-next-line typescript/no-empty-object-type
	interface EventsList extends InferAuthEvents<Authenticators> {}
}
