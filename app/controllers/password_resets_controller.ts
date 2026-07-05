import type { HttpContext } from '@adonisjs/core/http';

import passwordResetService from '#services/password_reset_service';
import { forgotPasswordValidator, resetPasswordValidator } from '#validators/user';

export default class PasswordResetsController {
	async create({ inertia }: HttpContext) {
		return inertia.render('auth/forgot-password', {});
	}

	async store({ request, response, session }: HttpContext) {
		const { email } = await request.validateUsing(forgotPasswordValidator);

		await passwordResetService.requestReset(email);

		session.flash('success', 'If an account exists for that email, we sent a link to reset the password.');
		response.redirect().toRoute('password_resets.create');
	}

	async edit({ params, inertia }: HttpContext) {
		return inertia.render('auth/reset-password', { token: params.token });
	}

	async update({ request, response, session }: HttpContext) {
		const { token, password } = await request.validateUsing(resetPasswordValidator);

		const wasReset = await passwordResetService.resetPassword(token, password);

		if (!wasReset) {
			session.flash('error', 'This password reset link is invalid or has expired.');
			response.redirect().toRoute('password_resets.create');

			return;
		}

		session.flash('success', 'Your password has been reset. You can now log in.');
		response.redirect().toRoute('session.create');
	}
}
