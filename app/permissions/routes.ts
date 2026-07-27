import router from '@adonisjs/core/services/router';

import { middleware } from '#start/kernel';

router
	.group(() => {
		router
			.get('/roles', [async () => import('./controllers/roles_controller.ts'), 'index'])
			.as('roles.index')
			.use(middleware.acl('members.manage'));

		router
			.get('/roles/create', [async () => import('./controllers/roles_controller.ts'), 'create'])
			.as('roles.create')
			.use(middleware.acl('members.manage'));

		router
			.post('/roles', [async () => import('./controllers/roles_controller.ts'), 'store'])
			.as('roles.store')
			.use(middleware.acl('members.manage'));

		router
			.delete('/roles/:slug', [async () => import('./controllers/roles_controller.ts'), 'destroy'])
			.as('roles.destroy')
			.use(middleware.acl('members.manage'));
	})
	.prefix('admin')
	.use(middleware.auth())
	.as('admin');
