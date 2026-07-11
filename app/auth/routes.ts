import router from '@adonisjs/core/services/router';

import { middleware } from '#start/kernel';

router
	.group(() => {
		router
			.group(() => {
				router.get('login', [async () => import('./controllers/session_controller.ts'), 'create']).as('create');
				router.post('login', [async () => import('./controllers/session_controller.ts'), 'store']).as('store');
			})
			.use(middleware.guest());

		router
			.post('logout', [async () => import('./controllers/session_controller.ts'), 'destroy'])
			.as('destroy')
			.use(middleware.auth());
	})
	.as('session');

router
	.group(() => {
		router
			.get('forgot-password', [async () => import('./controllers/password_resets_controller.ts'), 'create'])
			.as('create');

		router
			.post('forgot-password', [async () => import('./controllers/password_resets_controller.ts'), 'store'])
			.as('store');

		router
			.get('reset-password/:token', [async () => import('./controllers/password_resets_controller.ts'), 'edit'])
			.as('edit');

		router
			.post('reset-password', [async () => import('./controllers/password_resets_controller.ts'), 'update'])
			.as('update');
	})
	.use(middleware.guest())
	.as('password_resets');
