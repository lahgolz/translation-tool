// oxlint-disable unbound-method

import testUtils from '@adonisjs/core/services/test_utils';
import { test } from '@japa/runner';

import User from '#users/models/user';

test.group('Session / login (browser)', (group) => {
	group.each.setup(async () => testUtils.db().wrapInGlobalTransaction());

	test('logs in with valid credentials', async ({ visit, route }) => {
		const user = await User.create({ email: 'test@example.com', password: 'secret123' });
		await user.allow('project.view');

		const page = await visit(route('session.create'));

		await page.getByLabel('Email').fill('test@example.com');
		await page.getByLabel('Password').fill('secret123');
		await page.getByRole('button', { name: 'Login' }).click();

		await page.assertPath('/projects');
	});

	test('shows an error for invalid credentials', async ({ visit, route }) => {
		await User.create({ email: 'test@example.com', password: 'secret123' });

		const page = await visit(route('session.create'));

		await page.getByLabel('Email').fill('test@example.com');
		await page.getByLabel('Password').fill('wrong-password');
		await page.getByRole('button', { name: 'Login' }).click();

		await page.assertPath('/login');
		await page.assertTextContains('body', 'Invalid email or password');
	});

	test('shows a validation error for a missing password', async ({ visit, route }) => {
		const page = await visit(route('session.create'));

		await page.getByLabel('Email').fill('test@example.com');
		await page.getByRole('button', { name: 'Login' }).click();

		await page.assertTextContains('body', 'The password field must be defined');
	});

	test('redirects an authenticated user away from the login page', async ({ visit, route }) => {
		const user = await User.create({ email: 'test@example.com', password: 'secret123' });
		await user.allow('project.view');

		const page = await visit(route('session.create'));

		await page.getByLabel('Email').fill('test@example.com');
		await page.getByLabel('Password').fill('secret123');
		await page.getByRole('button', { name: 'Login' }).click();
		await page.assertPath('/projects');

		await page.goto(route('session.create'));
		await page.assertPath('/projects');
	});
});
