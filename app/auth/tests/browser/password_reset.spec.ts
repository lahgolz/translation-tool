// oxlint-disable unbound-method

import hash from '@adonisjs/core/services/hash';
import testUtils from '@adonisjs/core/services/test_utils';
import { test } from '@japa/runner';

import User from '#users/models/user';

import passwordResetService from '../../services/password_reset_service.ts';

test.group('Password reset (browser)', (group) => {
	group.each.setup(async () => testUtils.db().wrapInGlobalTransaction());

	test('requests a reset link from the login page', async ({ visit, route }) => {
		await User.create({ email: 'test@example.com', password: 'secret123' });

		const page = await visit(route('session.create'));

		await page.getByRole('link', { name: 'Forgot password?' }).click();
		await page.assertPath('/forgot-password');

		await page.getByLabel('Email').fill('test@example.com');
		await page.getByRole('button', { name: 'Send reset link' }).click();

		await page.assertTextContains('body', 'If an account exists for that email, we sent a link');
	});

	test('resets the password from the emailed link', async ({ visit, route }) => {
		hash.fake();

		const user = await User.create({ email: 'test@example.com', password: 'secret123' });
		await user.allow('project.view');

		const token = await passwordResetService.generateFor(user);

		const page = await visit(route('password_resets.edit', { token }));

		await page.getByLabel('New password').fill('new-secret123');
		await page.getByLabel('Confirm password').fill('new-secret123');
		await page.getByRole('button', { name: 'Reset password' }).click();

		await page.assertPath('/login');
		await page.assertTextContains('body', 'Your password has been reset');

		await page.getByLabel('Email').fill('test@example.com');
		await page.getByLabel('Password').fill('new-secret123');
		await page.getByRole('button', { name: 'Login' }).click();

		await page.assertPath('/projects');

		hash.restore();
	});
});
