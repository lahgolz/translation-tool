import testUtils from '@adonisjs/core/services/test_utils';
import { test } from '@japa/runner';

import User from '#models/user';

test.group('Session / login', (group) => {
	group.each.setup(async () => testUtils.db().wrapInGlobalTransaction());

	test('renders the login page for a guest', async ({ client }) => {
		const response = await client.get('/login').withInertia();

		response.assertStatus(200);
		response.assertInertiaComponent('auth/login');
	});

	test('redirects an authenticated user away from the login page', async ({ client }) => {
		const user = await User.create({ email: 'admin@example.com', password: 'secret123' });

		const response = await client.get('/login').loginAs(user);

		response.assertRedirectsTo('/');
	});

	test('logs in with valid credentials', async ({ client }) => {
		const user = await User.create({ email: 'admin@example.com', password: 'secret123' });

		const response = await client
			.post('/login')
			.redirects(0)
			.withCsrfToken()
			.form({ email: 'admin@example.com', password: 'secret123' });

		response.assertHeader('location', '/');
		response.assertSession('auth_web', user.id);
	});

	test('rejects invalid credentials', async ({ client }) => {
		await User.create({ email: 'admin@example.com', password: 'secret123' });

		const response = await client
			.post('/login')
			.redirects(0)
			.withCsrfToken()
			.form({ email: 'admin@example.com', password: 'wrong-password' });

		response.assertSessionMissing('auth_web');
		response.assertFlashMessage('error', 'Invalid email or password');
	});

	test('rejects credentials for an email that does not exist', async ({ client }) => {
		const response = await client
			.post('/login')
			.redirects(0)
			.withCsrfToken()
			.form({ email: 'nobody@example.com', password: 'secret123' });

		response.assertSessionMissing('auth_web');
		response.assertFlashMessage('error', 'Invalid email or password');
	});

	test('redirects an authenticated user submitting the login form', async ({ client }) => {
		const user = await User.create({ email: 'admin@example.com', password: 'secret123' });

		const response = await client
			.post('/login')
			.redirects(0)
			.withCsrfToken()
			.loginAs(user)
			.form({ email: 'admin@example.com', password: 'secret123' });

		response.assertHeader('location', '/');
	});

	test('rejects a login request without a CSRF token', async ({ client }) => {
		const response = await client
			.post('/login')
			.redirects(0)
			.form({ email: 'admin@example.com', password: 'secret123' });

		response.assertStatus(302);
		response.assertSessionMissing('auth_web');
	});

	test('requires a valid email and a password', async ({ client }) => {
		const response = await client
			.post('/login')
			.withInertia()
			.withCsrfToken()
			.form({ email: 'not-an-email', password: '' });

		response.assertInertiaPropsContains({
			errors: {
				email: 'The email field must be a valid email address',
				password: 'The password field must be defined',
			},
		});
	});

	test('logs out an authenticated user', async ({ client }) => {
		const user = await User.create({ email: 'admin@example.com', password: 'secret123' });

		const response = await client.post('/logout').redirects(0).withCsrfToken().loginAs(user);

		response.assertHeader('location', '/login');
		response.assertSessionMissing('auth_web');
	});

	test('requires authentication to log out', async ({ client }) => {
		const response = await client.post('/logout').redirects(0).withCsrfToken();

		response.assertHeader('location', '/login');
	});
});
