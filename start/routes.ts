/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router';

import { controllers } from '#generated/controllers';
import { middleware } from '#start/kernel';

router.on('/').renderInertia('home', {}).as('home');

router
	.group(() => {
		router.get('login', [controllers.Session, 'create']);
		router.post('login', [controllers.Session, 'store']);

		router.get('forgot-password', [controllers.PasswordResets, 'create']);
		router.post('forgot-password', [controllers.PasswordResets, 'store']);
		router.get('reset-password/:token', [controllers.PasswordResets, 'edit']);
		router.post('reset-password', [controllers.PasswordResets, 'update']);
	})
	.use(middleware.guest());

router
	.group(() => {
		router.post('logout', [controllers.Session, 'destroy']);
	})
	.use(middleware.auth());
