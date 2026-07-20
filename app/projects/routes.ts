import router from '@adonisjs/core/services/router';

import { middleware } from '#start/kernel';

router
	.group(() => {
		router
			.get('/', [async () => import('./controllers/projects_controller.ts'), 'index'])
			.as('index')
			.title('Projects')
			.use(middleware.acl('project.view'));

		router
			.post('/', [async () => import('./controllers/projects_controller.ts'), 'store'])
			.as('store')
			.use(middleware.acl('project.manage'));

		router
			.get('/create', [async () => import('./controllers/projects_controller.ts'), 'create'])
			.as('create')
			.use(middleware.acl('project.manage'));

		router
			.get('/:slug', [async () => import('./controllers/projects_controller.ts'), 'show'])
			.as('show')
			.use(middleware.acl('project.view'));

		router
			.put('/:slug', [async () => import('./controllers/projects_controller.ts'), 'update'])
			.as('update')
			.use(middleware.acl('project.manage'));

		router
			.get('/:slug/settings', [async () => import('./controllers/projects_controller.ts'), 'settings'])
			.as('settings')
			.use(middleware.acl('project.manage'));

		router
			.group(() => {
				router
					.post('/:slug/picture', [async () => import('./controllers/project_pictures_controller.ts'), 'store'])
					.as('store')
					.use(middleware.acl('project.manage'));

				router
					.delete('/:slug/picture', [async () => import('./controllers/project_pictures_controller.ts'), 'destroy'])
					.as('destroy')
					.use(middleware.acl('project.manage'));
			})
			.as('picture');

		router
			.group(() => {
				router
					.post('/:slug/languages', [async () => import('./controllers/project_languages_controller.ts'), 'store'])
					.as('store')
					.use(middleware.acl('project.manage'));

				router
					.delete('/:slug/languages/:language', [
						async () => import('./controllers/project_languages_controller.ts'),
						'destroy',
					])
					.as('destroy')
					.use(middleware.acl('project.manage'));

				router
					.put('/:slug/languages/:language/default', [
						async () => import('./controllers/project_languages_controller.ts'),
						'setDefault',
					])
					.as('default')
					.use(middleware.acl('project.manage'));
			})
			.as('languages');
	})
	.prefix('projects')
	.use(middleware.auth())
	.as('projects');
