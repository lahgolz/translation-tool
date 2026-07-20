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
		await page.getByLabel('Languages').fill('English');
		await page.getByRole('option', { name: 'United States' }).click();
		await page.getByText('Set the project name and its languages.').click();
		await page.getByRole('button', { name: 'Create project' }).click();

		await page.assertPath('/projects/marketing-site');
		await page.assertTextContains('body', 'Marketing site');

		await page.goto(route('projects.index'));
		await page.getByRole('link', { name: 'Marketing site' }).click();

		await page.assertPath('/projects/marketing-site');
	});

	test('disables project creation until a language is added', async ({ visit, route, browserContext, assert }) => {
		await visit(route('home'));

		const user = await createAuthorizedUser();

		await browserContext.loginAs(user);

		const page = await visit(route('projects.index'));

		await page.getByRole('button', { name: 'New project' }).click();
		await page.getByLabel('Name').fill('Marketing site');

		assert.isTrue(await page.getByRole('button', { name: 'Create project' }).isDisabled());

		await page.getByLabel('Languages').fill('English');
		await page.getByRole('option', { name: 'United States' }).click();
		await page.getByText('Set the project name and its languages.').click();

		assert.isFalse(await page.getByRole('button', { name: 'Create project' }).isDisabled());
	});

	test('uploads and displays a project picture', async ({ visit, route, browserContext }) => {
		using _ = drive.fake('s3');

		await visit(route('home'));

		const user = await createAuthorizedUser();

		await browserContext.loginAs(user);

		const page = await visit(route('projects.index'));

		await page.getByRole('button', { name: 'New project' }).click();
		await page.getByLabel('Name').fill('Marketing site');
		await page.getByLabel('Languages').fill('English');
		await page.getByRole('option', { name: 'United States' }).click();
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

	test('adds a language to a project from the settings page', async ({ visit, route, browserContext }) => {
		const user = await createAuthorizedUser();
		await ProjectFactory.merge({ name: 'Marketing site', slug: 'marketing-site', defaultLanguage: 'en' }).create();

		await visit(route('home'));
		await browserContext.loginAs(user);

		const page = await visit(route('projects.settings', { slug: 'marketing-site' }));

		await page.getByRole('tab', { name: 'Languages' }).click();
		await page.getByLabel('Add a language').fill('French');
		await page.getByRole('option', { name: '(fr)' }).click();
		await page.getByRole('button', { name: 'Add language' }).click();

		await page.assertPath('/projects/marketing-site/settings');
		await page.assertTextContains('body', 'Français');
	});

	test('removes a language from a project after confirming', async ({ visit, route, browserContext }) => {
		const user = await createAuthorizedUser();
		const project = await ProjectFactory.merge({
			name: 'Marketing site',
			slug: 'marketing-site',
			defaultLanguage: 'en',
		}).create();
		await project.related('languages').createMany([{ languageCode: 'en' }, { languageCode: 'fr' }]);

		await visit(route('home'));
		await browserContext.loginAs(user);

		const page = await visit(route('projects.settings', { slug: 'marketing-site' }));

		await page.getByRole('tab', { name: 'Languages' }).click();
		await page.getByRole('button', { name: 'Remove French | Français (fr)' }).click();
		await page.getByRole('button', { name: 'Remove', exact: true }).click();

		await page.assertPath('/projects/marketing-site/settings');
		await page.assertNotExists(page.getByText('Français'));
	});

	test('sets a language as the default for a project', async ({ visit, route, browserContext }) => {
		const user = await createAuthorizedUser();
		const project = await ProjectFactory.merge({
			name: 'Marketing site',
			slug: 'marketing-site',
			defaultLanguage: 'en',
		}).create();
		await project.related('languages').createMany([{ languageCode: 'en' }, { languageCode: 'fr' }]);

		await visit(route('home'));
		await browserContext.loginAs(user);

		const page = await visit(route('projects.settings', { slug: 'marketing-site' }));

		await page.getByRole('tab', { name: 'Languages' }).click();
		await page.getByRole('button', { name: 'Set French | Français (fr) as default' }).click();

		await page.assertPath('/projects/marketing-site/settings');
		await page.getByRole('button', { name: 'Remove English | English (en)' }).waitFor({ state: 'attached' });
	});

	test('cannot remove the default language', async ({ visit, route, browserContext }) => {
		const user = await createAuthorizedUser();
		const project = await ProjectFactory.merge({
			name: 'Marketing site',
			slug: 'marketing-site',
			defaultLanguage: 'en',
		}).create();
		await project.related('languages').create({ languageCode: 'en' });

		await visit(route('home'));
		await browserContext.loginAs(user);

		const page = await visit(route('projects.settings', { slug: 'marketing-site' }));

		await page.getByRole('tab', { name: 'Languages' }).click();

		await page.assertTextContains('body', 'Default');
		await page.assertNotExists(page.getByRole('button', { name: /^Remove/ }));
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
