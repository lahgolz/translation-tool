// oxlint-disable unbound-method

import testUtils from '@adonisjs/core/services/test_utils';
import drive from '@adonisjs/drive/services/main';
import { test } from '@japa/runner';

import { ProjectFactory } from '#database/factories/project_factory';
import { UserFactory } from '#database/factories/user_factory';

async function createAuthorizedUser() {
	const user = await UserFactory.create();
	await user.allow('project.view');
	await user.allow('project.manage');

	return user;
}

const PNG_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGP4////fwAJ+wP9KobjigAAAABJRU5ErkJggg==';
const PNG_BUFFER = Buffer.from(PNG_BASE64, 'base64');

test.group('Projects (browser)', (group) => {
	group.each.setup(async () => testUtils.db().wrapInGlobalTransaction());

	test('creates a project and switches to it from the list', async ({ visit, route, browserContext }) => {
		await visit(route('home'));

		const user = await createAuthorizedUser();

		await browserContext.loginAs(user);

		const page = await visit(route('projects.index'));

		await page.getByRole('button', { name: 'New project' }).click();
		await page.getByLabel('Name').fill('Marketing site');
		await page.getByLabel('Default language').fill('en');
		await page.getByRole('button', { name: 'Create project' }).click();

		await page.assertPath('/projects/marketing-site');
		await page.assertTextContains('body', 'Marketing site');

		await page.goto(route('projects.index'));
		await page.getByRole('link', { name: 'Marketing site' }).click();

		await page.assertPath('/projects/marketing-site');
	});

	test('shows a validation error when the default language is missing', async ({ visit, route, browserContext }) => {
		await visit(route('home'));

		const user = await createAuthorizedUser();

		await browserContext.loginAs(user);

		const page = await visit(route('projects.index'));

		await page.getByRole('button', { name: 'New project' }).click();
		await page.getByLabel('Name').fill('Marketing site');
		await page.getByRole('button', { name: 'Create project' }).click();

		await page.assertTextContains('body', 'The defaultLanguage field must be defined');
	});

	test('uploads and displays a project picture', async ({ visit, route, browserContext }) => {
		using _ = drive.fake('s3');

		await visit(route('home'));

		const user = await createAuthorizedUser();

		await browserContext.loginAs(user);

		const page = await visit(route('projects.index'));

		await page.getByRole('button', { name: 'New project' }).click();
		await page.getByLabel('Name').fill('Marketing site');
		await page.getByLabel('Default language').fill('en');
		await page.getByLabel('Picture').setInputFiles({ name: 'picture.png', mimeType: 'image/png', buffer: PNG_BUFFER });
		await page.getByRole('button', { name: 'Create project' }).click();

		await page.assertPath('/projects/marketing-site');
		await page.locator('[data-slot="project-picture"]').waitFor({ state: 'attached' });
	});

	test('opens project settings from the list card dropdown', async ({ visit, route, browserContext }) => {
		await visit(route('home'));

		const user = await createAuthorizedUser();
		await ProjectFactory.merge({ name: 'Marketing site', slug: 'marketing-site', defaultLanguage: 'en' }).create();

		await browserContext.loginAs(user);

		const page = await visit(route('projects.index'));

		await page.getByRole('button', { name: 'Project actions' }).click();
		await page.getByRole('menuitem', { name: 'Settings' }).click();

		await page.assertPath('/projects/marketing-site/settings');
		await page.getByLabel('Name').fill('Marketing Site Renamed');
		await page.getByRole('button', { name: 'Save changes' }).click();

		await page.assertPath('/projects/marketing-site-renamed');
		await page.assertTextContains('body', 'Marketing Site Renamed');
	});

	test('opens project settings from the show page', async ({ visit, route, browserContext }) => {
		const user = await createAuthorizedUser();
		await ProjectFactory.merge({ name: 'Marketing site', slug: 'marketing-site', defaultLanguage: 'en' }).create();

		await visit(route('home'));
		await browserContext.loginAs(user);

		const page = await visit(route('projects.show', { slug: 'marketing-site' }));

		await page.getByRole('link', { name: 'Settings' }).click();

		await page.assertPath('/projects/marketing-site/settings');
	});

	test('uploads a project picture through the picture dialog', async ({ visit, route, browserContext }) => {
		using _ = drive.fake('s3');
		const user = await createAuthorizedUser();
		await ProjectFactory.merge({ name: 'Marketing site', slug: 'marketing-site', defaultLanguage: 'en' }).create();

		await visit(route('home'));
		await browserContext.loginAs(user);

		const page = await visit(route('projects.settings', { slug: 'marketing-site' }));

		await page.getByRole('button', { name: 'Change project picture' }).click();
		await page
			.getByLabel('Picture', { exact: true })
			.setInputFiles({ name: 'picture.png', mimeType: 'image/png', buffer: PNG_BUFFER });
		await page.getByRole('button', { name: 'Save' }).click();

		await page.assertPath('/projects/marketing-site/settings');
		await page.locator('[data-slot="project-picture"]').waitFor({ state: 'attached' });
	});

	test('deletes a project picture through the picture dialog', async ({ visit, route, browserContext }) => {
		using _ = drive.fake('s3');
		const user = await createAuthorizedUser();
		await ProjectFactory.merge({
			name: 'Marketing site',
			slug: 'marketing-site',
			defaultLanguage: 'en',
			picture: 'projects/existing.png',
		}).create();

		await visit(route('home'));
		await browserContext.loginAs(user);

		const page = await visit(route('projects.settings', { slug: 'marketing-site' }));

		await page.getByRole('button', { name: 'Change project picture' }).click();
		await page.getByRole('button', { name: 'Delete picture' }).click();

		await page.assertPath('/projects/marketing-site/settings');
		await page.locator('[data-slot="project-picture"]').waitFor({ state: 'detached' });
	});
});
