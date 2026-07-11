import router from '@adonisjs/core/services/router';

import { middleware } from '#start/kernel';

router
	.group(() => {
		router
			.get('/', [async () => import('#projects/controllers/projects_controller'), 'index'])
			.as('index')
			.use(middleware.acl('project.view'));

		router
			.post('/', [async () => import('#projects/controllers/projects_controller'), 'store'])
			.as('store')
			.use(middleware.acl('project.manage'));

		router
			.get('/:slug', [async () => import('#projects/controllers/projects_controller'), 'show'])
			.as('show')
			.use(middleware.acl('project.view'));

		router
			.put('/:slug', [async () => import('#projects/controllers/projects_controller'), 'update'])
			.as('update')
			.use(middleware.acl('project.manage'));
	})
	.prefix('projects')
	.use(middleware.auth())
	.as('projects');
