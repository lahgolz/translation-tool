import { errors } from '@adonisjs/auth';
import type { HttpContext } from '@adonisjs/core/http';

import User from '#users/models/user';

import { loginValidator } from '../validators/user.ts';

export default class SessionController {
	async create({ inertia }: HttpContext) {
		return inertia.render('auth/login', {});
	}

	async store({ request, auth, response, session }: HttpContext) {
		const { email, password } = await request.validateUsing(loginValidator);

		try {
			const user = await User.verifyCredentials(email, password);

			await auth.use('web').login(user);
		} catch (error) {
			if (!(error instanceof errors.E_INVALID_CREDENTIALS)) {
				throw error;
			}

			session.flash('error', 'Invalid email or password');
			response.redirect().back();

			return;
		}

		response.redirect().toRoute('home');
	}

	async destroy({ auth, response }: HttpContext) {
		await auth.use('web').logout();

		response.redirect().toRoute('session.create');
	}
}
