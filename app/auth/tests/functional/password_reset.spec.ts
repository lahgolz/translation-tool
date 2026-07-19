import testUtils from '@adonisjs/core/services/test_utils';
import mail from '@adonisjs/mail/services/main';
import { test } from '@japa/runner';
import { timeTravel } from '@japa/runner';

import User from '#users/models/user';

import ResetPasswordNotification from '../../mails/reset_password_notification.ts';
import passwordResetService from '../../services/password_reset_service.ts';

test.group('Password reset', (group) => {
	group.each.setup(async () => testUtils.db().wrapInGlobalTransaction());

	test('renders the forgot password page for a guest', async ({ client }) => {
		const response = await client.get('/forgot-password').withInertia();

		response.assertStatus(200);
		response.assertInertiaComponent('auth/forgot-password');
	});

	test('renders the reset password page with the token', async ({ client }) => {
		const response = await client.get('/reset-password/some-token').withInertia();

		response.assertStatus(200);
		response.assertInertiaComponent('auth/reset-password');
		response.assertInertiaPropsContains({ token: 'some-token' });
	});

	test('redirects an authenticated user away from the forgot password page', async ({ client }) => {
		const user = await User.create({ email: 'test@example.com', password: 'secret123' });

		const response = await client.get('/forgot-password').loginAs(user);

		response.assertRedirectsTo('/');
	});

	test('redirects an authenticated user away from the reset password page', async ({ client }) => {
		const user = await User.create({ email: 'test@example.com', password: 'secret123' });

		const response = await client.get('/reset-password/some-token').loginAs(user);

		response.assertRedirectsTo('/');
	});

	test('requires a valid email to request a reset', async ({ client }) => {
		const response = await client
			.post('/forgot-password')
			.withInertia()
			.withCsrfToken()
			.header('referer', '/forgot-password')
			.form({ email: 'not-an-email' });

		response.assertInertiaPropsContains({
			errors: {
				email: 'The email field must be a valid email address',
			},
		});
	});

	test('rejects a forgot password request without a CSRF token', async ({ client }) => {
		using fake = mail.fake();
		const user = await User.create({ email: 'test@example.com', password: 'secret123' });

		const response = await client.post('/forgot-password').redirects(0).form({ email: user.email });

		response.assertStatus(302);
		fake.mails.assertNoneQueued();
	});

	test('sends a reset email when the account exists', async ({ client }) => {
		using fake = mail.fake();
		const user = await User.create({ email: 'test@example.com', password: 'secret123' });

		const response = await client.post('/forgot-password').redirects(0).withCsrfToken().form({ email: user.email });

		response.assertHeader('location', '/forgot-password');
		response.assertFlashMessage(
			'success',
			'If an account exists for that email, we sent a link to reset the password.',
		);
		fake.mails.assertQueued(ResetPasswordNotification, ({ message }) => message.hasTo(user.email));
	});

	test('does not reveal whether the account exists', async ({ client }) => {
		using fake = mail.fake();

		const response = await client
			.post('/forgot-password')
			.redirects(0)
			.withCsrfToken()
			.form({ email: 'nobody@example.com' });

		response.assertHeader('location', '/forgot-password');
		response.assertFlashMessage(
			'success',
			'If an account exists for that email, we sent a link to reset the password.',
		);
		fake.mails.assertNoneQueued();
	});

	test('resets the password with a valid token', async ({ client }) => {
		using fake = mail.fake();
		const user = await User.create({ email: 'test@example.com', password: 'secret123' });

		await client.post('/forgot-password').withCsrfToken().form({ email: user.email });

		let resetUrl = '';

		fake.mails.assertQueued(ResetPasswordNotification, (resetMail) => {
			resetUrl = resetMail.resetUrl;

			return resetMail.message.hasTo(user.email);
		});

		const token = new URL(resetUrl).pathname.split('/').pop();

		const response = await client
			.post('/reset-password')
			.redirects(0)
			.withCsrfToken()
			.form({ token, password: 'new-secret123', password_confirmation: 'new-secret123' });

		response.assertHeader('location', '/login');
		response.assertFlashMessage('success', 'Your password has been reset. You can now log in.');

		await User.verifyCredentials(user.email, 'new-secret123');
	});

	test('deletes the token so it cannot be reused', async ({ client }) => {
		const user = await User.create({ email: 'test@example.com', password: 'secret123' });
		const token = await passwordResetService.generateFor(user);

		await client
			.post('/reset-password')
			.withCsrfToken()
			.form({ token, password: 'new-secret123', password_confirmation: 'new-secret123' });

		const response = await client
			.post('/reset-password')
			.redirects(0)
			.withCsrfToken()
			.form({ token, password: 'another-secret123', password_confirmation: 'another-secret123' });

		response.assertHeader('location', '/forgot-password');
		response.assertFlashMessage('error', 'This password reset link is invalid or has expired.');
	});

	test('rejects an expired token', async ({ client }) => {
		const user = await User.create({ email: 'test@example.com', password: 'secret123' });
		const token = await passwordResetService.generateFor(user);

		timeTravel('2 hours');

		const response = await client
			.post('/reset-password')
			.redirects(0)
			.withCsrfToken()
			.form({ token, password: 'new-secret123', password_confirmation: 'new-secret123' });

		response.assertHeader('location', '/forgot-password');
		response.assertFlashMessage('error', 'This password reset link is invalid or has expired.');
	});

	test('rejects an unknown token', async ({ client }) => {
		const response = await client
			.post('/reset-password')
			.redirects(0)
			.withCsrfToken()
			.form({ token: 'unknown-token', password: 'new-secret123', password_confirmation: 'new-secret123' });

		response.assertHeader('location', '/forgot-password');
		response.assertFlashMessage('error', 'This password reset link is invalid or has expired.');
	});

	test('invalidates a previous token when a new reset is requested', async ({ client }) => {
		const user = await User.create({ email: 'test@example.com', password: 'secret123' });
		const firstToken = await passwordResetService.generateFor(user);

		await client.post('/forgot-password').withCsrfToken().form({ email: user.email });

		const response = await client
			.post('/reset-password')
			.redirects(0)
			.withCsrfToken()
			.form({ token: firstToken, password: 'new-secret123', password_confirmation: 'new-secret123' });

		response.assertHeader('location', '/forgot-password');
		response.assertFlashMessage('error', 'This password reset link is invalid or has expired.');
	});

	test('the old password no longer works after a successful reset', async ({ client }) => {
		const user = await User.create({ email: 'test@example.com', password: 'secret123' });
		const token = await passwordResetService.generateFor(user);

		await client
			.post('/reset-password')
			.withCsrfToken()
			.form({ token, password: 'new-secret123', password_confirmation: 'new-secret123' });

		const response = await client
			.post('/login')
			.redirects(0)
			.withCsrfToken()
			.form({ email: user.email, password: 'secret123' });

		response.assertSessionMissing('auth_web');
		response.assertFlashMessage('error', 'Invalid email or password');
	});

	test('requires the new password to meet the minimum length', async ({ client }) => {
		const user = await User.create({ email: 'test@example.com', password: 'secret123' });
		const token = await passwordResetService.generateFor(user);

		const response = await client
			.post('/reset-password')
			.withInertia()
			.withCsrfToken()
			.header('referer', `/reset-password/${token}`)
			.form({ token, password: 'short', password_confirmation: 'short' });

		response.assertInertiaPropsContains({
			errors: {
				password: 'The password field must have at least 8 characters',
			},
		});
	});

	test('requires the password confirmation to match', async ({ client }) => {
		const user = await User.create({ email: 'test@example.com', password: 'secret123' });
		const token = await passwordResetService.generateFor(user);

		const response = await client
			.post('/reset-password')
			.withInertia()
			.withCsrfToken()
			.header('referer', `/reset-password/${token}`)
			.form({ token, password: 'new-secret123', password_confirmation: 'does-not-match' });

		response.assertInertiaPropsContains({
			errors: {
				password_confirmation: 'The password field and password_confirmation field must be the same',
			},
		});
	});

	test('rejects a reset password request without a CSRF token', async ({ client }) => {
		const user = await User.create({ email: 'test@example.com', password: 'secret123' });
		const token = await passwordResetService.generateFor(user);

		const response = await client
			.post('/reset-password')
			.redirects(0)
			.form({ token, password: 'new-secret123', password_confirmation: 'new-secret123' });

		response.assertStatus(302);

		await User.verifyCredentials(user.email, 'secret123');
	});
});
