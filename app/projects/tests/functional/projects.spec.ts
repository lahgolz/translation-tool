import Project from '#projects/models/project';
import testUtils from '@adonisjs/core/services/test_utils';
import drive from '@adonisjs/drive/services/main';
import { test } from '@japa/runner';

import User from '#users/models/user';

// A valid, minimal 1x1 transparent PNG. Bodyparser detects file types from the
// magic number for image extensions, so a real PNG is required for the extname
// validation in `vine.file()` to pass.
const PNG_BUFFER = Buffer.from(
	'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
	'base64',
);

async function createAuthorizedUser(email: string) {
	const user = await User.create({ email, password: 'secret123' });
	await user.allow('project.view');
	await user.allow('project.manage');

	return user;
}

test.group('Projects', (group) => {
	group.each.setup(async () => testUtils.db().wrapInGlobalTransaction());

	test('requires authentication to list projects', async ({ client }) => {
		const response = await client.get('/projects').redirects(0);

		response.assertHeader('location', '/login');
	});

	test('rejects a user without the project.view permission from the list', async ({ client }) => {
		const user = await User.create({ email: 'no-access@example.com', password: 'secret123' });

		const response = await client.get('/projects').loginAs(user);

		response.assertStatus(403);
	});

	test('lists projects for an authorized user', async ({ client }) => {
		const user = await createAuthorizedUser('manager@example.com');
		await Project.create({
			name: 'Marketing site',
			slug: 'marketing-site',
			defaultLanguage: 'en',
		});

		const response = await client.get('/projects').loginAs(user).withInertia();

		response.assertStatus(200);
		response.assertInertiaComponent('projects/index');
		response.assertInertiaPropsContains({
			projects: [{ name: 'Marketing site', slug: 'marketing-site', defaultLanguage: 'en' }],
		});
	});

	test('creates a project', async ({ client, assert }) => {
		const user = await createAuthorizedUser('manager2@example.com');

		const response = await client
			.post('/projects')
			.loginAs(user)
			.redirects(0)
			.withCsrfToken()
			.form({ name: 'Marketing site', 'languages[]': ['en'], defaultLanguage: 'en' });

		response.assertHeader('location', '/projects/marketing-site');

		const project = await Project.findByOrFail('slug', 'marketing-site');
		assert.equal(project.name, 'Marketing site');
		assert.equal(project.defaultLanguage, 'en');
	});

	test('creates a project with multiple languages', async ({ client, assert }) => {
		const user = await createAuthorizedUser('manager-multi-language@example.com');

		await client
			.post('/projects')
			.loginAs(user)
			.redirects(0)
			.withCsrfToken()
			.form({ name: 'Marketing site', 'languages[]': ['en', 'fr', 'de'], defaultLanguage: 'fr' });

		const project = await Project.findByOrFail('slug', 'marketing-site');
		await project.load('languages');

		assert.equal(project.defaultLanguage, 'fr');
		assert.sameMembers(
			project.languages.map((language) => language.languageCode),
			['en', 'fr', 'de'],
		);

		const response = await client.get('/projects').loginAs(user).withInertia();

		response.assertInertiaPropsContains({
			projects: [{ slug: 'marketing-site', languages: ['en', 'fr', 'de'] }],
		});
	});

	test('creates a project with a picture', async ({ client, assert }) => {
		using fakeDisk = drive.fake('s3');
		const user = await createAuthorizedUser('manager-picture@example.com');

		const response = await client
			.post('/projects')
			.loginAs(user)
			.redirects(0)
			.withCsrfToken()
			.field('name', 'Marketing site')
			.field('languages[]', 'en')
			.field('defaultLanguage', 'en')
			.file('picture', PNG_BUFFER, { filename: 'picture.png', contentType: 'image/png' });

		response.assertHeader('location', '/projects/marketing-site');

		const project = await Project.findByOrFail('slug', 'marketing-site');
		assert.isNotNull(project.picture);
		fakeDisk.assertExists(project.picture ?? '');
	});

	test('generates a unique slug when project names collide', async ({ client, assert }) => {
		const user = await createAuthorizedUser('manager3@example.com');

		await client
			.post('/projects')
			.loginAs(user)
			.withCsrfToken()
			.form({ name: 'Marketing site', 'languages[]': ['en'], defaultLanguage: 'en' });
		await client
			.post('/projects')
			.loginAs(user)
			.withCsrfToken()
			.form({ name: 'Marketing site', 'languages[]': ['fr'], defaultLanguage: 'fr' });

		const projects = await Project.query().where('name', 'Marketing site').orderBy('id', 'asc');

		assert.lengthOf(projects, 2);
		assert.equal(projects[0].slug, 'marketing-site');
		assert.equal(projects[1].slug, 'marketing-site-2');
	});

	test('rejects project creation for a user without the project.manage permission', async ({ client }) => {
		const user = await User.create({ email: 'viewer@example.com', password: 'secret123' });
		await user.allow('project.view');

		const response = await client
			.post('/projects')
			.loginAs(user)
			.redirects(0)
			.withCsrfToken()
			.form({ name: 'Marketing site', 'languages[]': ['en'], defaultLanguage: 'en' });

		response.assertStatus(403);
	});

	test('validates project creation input', async ({ client }) => {
		const user = await createAuthorizedUser('manager4@example.com');

		const response = await client
			.post('/projects')
			.loginAs(user)
			.withInertia()
			.withCsrfToken()
			.header('referer', '/projects/create')
			.form({ name: '', defaultLanguage: '' });

		response.assertInertiaPropsContains({
			errors: {
				name: 'The name field must be defined',
				languages: 'The languages field must be defined',
				defaultLanguage: 'The defaultLanguage field must be defined',
			},
		});
	});

	test('requires at least one language', async ({ client }) => {
		const user = await createAuthorizedUser('manager-no-languages@example.com');

		const response = await client
			.post('/projects')
			.loginAs(user)
			.withInertia()
			.withCsrfToken()
			.header('referer', '/projects/create')
			.json({ name: 'Marketing site', languages: [], defaultLanguage: 'en' });

		response.assertInertiaPropsContains({
			errors: { languages: 'The languages field must have at least 1 items' },
		});
	});

	test('rejects a default language that is not among the selected languages', async ({ client }) => {
		const user = await createAuthorizedUser('manager-bad-default@example.com');

		const response = await client
			.post('/projects')
			.loginAs(user)
			.withInertia()
			.withCsrfToken()
			.header('referer', '/projects/create')
			.form({ name: 'Marketing site', 'languages[]': ['en', 'fr'], defaultLanguage: 'de' });

		response.assertInertiaPropsContains({
			errors: { defaultLanguage: 'The selected defaultLanguage is invalid' },
		});
	});

	test('shows a project by slug', async ({ client }) => {
		const user = await createAuthorizedUser('manager5@example.com');
		await Project.create({
			name: 'Marketing site',
			slug: 'marketing-site',
			defaultLanguage: 'en',
		});

		const response = await client.get('/projects/marketing-site').loginAs(user).withInertia();

		response.assertStatus(200);
		response.assertInertiaComponent('projects/show');
		response.assertInertiaPropsContains({
			project: { name: 'Marketing site', slug: 'marketing-site' },
			breadcrumbs: [
				{ title: 'Projects', url: '/projects' },
				{ title: 'Marketing site', url: '/projects/marketing-site' },
			],
		});
	});

	test('redirects the home page to the projects list', async ({ client }) => {
		const user = await createAuthorizedUser('manager-home@example.com');

		const response = await client.get('/').loginAs(user).redirects(0);

		response.assertHeader('location', '/projects');
	});

	test('opens the create project modal for an authorized user', async ({ client }) => {
		const user = await createAuthorizedUser('manager-create@example.com');

		const response = await client.get('/projects/create').loginAs(user);

		response.assertStatus(200);
	});

	test('rejects the create project modal for a user without the project.manage permission', async ({ client }) => {
		const user = await User.create({ email: 'viewer-create@example.com', password: 'secret123' });
		await user.allow('project.view');

		const response = await client.get('/projects/create').loginAs(user);

		response.assertStatus(403);
	});

	test('shows the settings page for an authorized user', async ({ client }) => {
		const user = await createAuthorizedUser('manager-settings@example.com');
		await Project.create({
			name: 'Marketing site',
			slug: 'marketing-site',
			defaultLanguage: 'en',
		});

		const response = await client.get('/projects/marketing-site/settings').loginAs(user).withInertia();

		response.assertStatus(200);
		response.assertInertiaComponent('projects/settings');
		response.assertInertiaPropsContains({
			project: { name: 'Marketing site', slug: 'marketing-site' },
			breadcrumbs: [
				{ title: 'Projects', url: '/projects' },
				{ title: 'Marketing site', url: '/projects/marketing-site' },
				{ title: 'Settings', url: '/projects/marketing-site/settings' },
			],
		});
	});

	test('rejects the settings page for a user without the project.manage permission', async ({ client }) => {
		const user = await User.create({ email: 'viewer-settings@example.com', password: 'secret123' });
		await user.allow('project.view');
		await Project.create({
			name: 'Marketing site',
			slug: 'marketing-site',
			defaultLanguage: 'en',
		});

		const response = await client.get('/projects/marketing-site/settings').loginAs(user);

		response.assertStatus(403);
	});

	test('updates project settings', async ({ client, assert }) => {
		const user = await createAuthorizedUser('manager6@example.com');
		const project = await Project.create({
			name: 'Marketing site',
			slug: 'marketing-site',
			defaultLanguage: 'en',
		});

		const response = await client
			.put('/projects/marketing-site')
			.loginAs(user)
			.redirects(0)
			.withCsrfToken()
			.form({ name: 'Marketing Site' });

		response.assertHeader('location', '/projects/marketing-site');

		await project.refresh();
		assert.equal(project.name, 'Marketing Site');
	});

	test('uploads a project picture via the dedicated endpoint', async ({ client, assert }) => {
		using fakeDisk = drive.fake('s3');
		const user = await createAuthorizedUser('manager-picture2@example.com');
		const project = await Project.create({
			name: 'Marketing site',
			slug: 'marketing-site',
			defaultLanguage: 'en',
		});

		const response = await client
			.post('/projects/marketing-site/picture')
			.loginAs(user)
			.redirects(0)
			.withCsrfToken()
			.file('picture', PNG_BUFFER, { filename: 'picture.png', contentType: 'image/png' });

		response.assertStatus(302);

		await project.refresh();
		assert.isNotNull(project.picture);
		fakeDisk.assertExists(project.picture ?? '');
	});

	test('replaces the existing project picture and removes the old file', async ({ client, assert }) => {
		using fakeDisk = drive.fake('s3');
		const user = await createAuthorizedUser('manager-picture3@example.com');
		const project = await Project.create({
			name: 'Marketing site',
			slug: 'marketing-site',
			defaultLanguage: 'en',
			picture: 'projects/old.png',
		});
		await fakeDisk.put('projects/old.png', 'old-image');

		const response = await client
			.post('/projects/marketing-site/picture')
			.loginAs(user)
			.redirects(0)
			.withCsrfToken()
			.file('picture', PNG_BUFFER, { filename: 'new.png', contentType: 'image/png' });

		response.assertStatus(302);

		await project.refresh();
		assert.isNotNull(project.picture);
		assert.notEqual(project.picture, 'projects/old.png');
		fakeDisk.assertExists(project.picture ?? '');
		fakeDisk.assertMissing('projects/old.png');
	});

	test('deletes the project picture via the dedicated endpoint', async ({ client, assert }) => {
		using fakeDisk = drive.fake('s3');
		const user = await createAuthorizedUser('manager-picture4@example.com');
		const project = await Project.create({
			name: 'Marketing site',
			slug: 'marketing-site',
			defaultLanguage: 'en',
			picture: 'projects/old.png',
		});
		await fakeDisk.put('projects/old.png', 'old-image');

		const response = await client.delete('/projects/marketing-site/picture').loginAs(user).redirects(0).withCsrfToken();

		response.assertStatus(302);

		await project.refresh();
		assert.isNull(project.picture);
		fakeDisk.assertMissing('projects/old.png');
	});

	test('rejects project picture uploads for a user without the project.manage permission', async ({
		client,
		assert,
	}) => {
		const viewer = await User.create({ email: 'viewer-picture@example.com', password: 'secret123' });
		await viewer.allow('project.view');
		const project = await Project.create({
			name: 'Marketing site',
			slug: 'marketing-site',
			defaultLanguage: 'en',
		});

		const response = await client
			.post('/projects/marketing-site/picture')
			.loginAs(viewer)
			.redirects(0)
			.withCsrfToken()
			.file('picture', PNG_BUFFER, { filename: 'picture.png', contentType: 'image/png' });

		response.assertStatus(403);

		await project.refresh();
		assert.isNull(project.picture);
	});

	test('rejects project settings updates for a user without the project.manage permission', async ({
		client,
		assert,
	}) => {
		await createAuthorizedUser('manager7@example.com');
		const project = await Project.create({
			name: 'Marketing site',
			slug: 'marketing-site',
			defaultLanguage: 'en',
		});

		const viewer = await User.create({ email: 'viewer2@example.com', password: 'secret123' });
		await viewer.allow('project.view');

		const response = await client
			.put('/projects/marketing-site')
			.loginAs(viewer)
			.redirects(0)
			.withCsrfToken()
			.form({ name: 'Renamed' });

		response.assertStatus(403);

		await project.refresh();
		assert.equal(project.name, 'Marketing site');
	});

	test('adds a language to an existing project', async ({ client, assert }) => {
		const user = await createAuthorizedUser('manager-add-language@example.com');
		const project = await Project.create({
			name: 'Marketing site',
			slug: 'marketing-site',
			defaultLanguage: 'en',
		});
		await project.related('languages').create({ languageCode: 'en' });

		const response = await client
			.post('/projects/marketing-site/languages')
			.loginAs(user)
			.redirects(0)
			.withCsrfToken()
			.form({ language: 'fr' });

		response.assertStatus(302);

		await project.load('languages');
		assert.sameMembers(
			project.languages.map((language) => language.languageCode),
			['en', 'fr'],
		);
	});

	test('does not duplicate a language that has already been added', async ({ client, assert }) => {
		const user = await createAuthorizedUser('manager-dup-language@example.com');
		const project = await Project.create({
			name: 'Marketing site',
			slug: 'marketing-site',
			defaultLanguage: 'en',
		});
		await project.related('languages').create({ languageCode: 'en' });

		const response = await client
			.post('/projects/marketing-site/languages')
			.loginAs(user)
			.redirects(0)
			.withCsrfToken()
			.form({ language: 'en' });

		response.assertStatus(302);

		await project.load('languages');
		assert.sameMembers(
			project.languages.map((language) => language.languageCode),
			['en'],
		);
	});

	test('validates the language code format when adding a language', async ({ client }) => {
		const user = await createAuthorizedUser('manager-bad-language@example.com');
		await Project.create({
			name: 'Marketing site',
			slug: 'marketing-site',
			defaultLanguage: 'en',
		});

		const response = await client
			.post('/projects/marketing-site/languages')
			.loginAs(user)
			.withInertia()
			.withCsrfToken()
			.header('referer', '/projects/marketing-site/settings')
			.form({ language: 'not a code' });

		response.assertInertiaPropsContains({
			errors: { language: 'The language field format is invalid' },
		});
	});

	test('rejects adding a language for a user without the project.manage permission', async ({ client, assert }) => {
		const viewer = await User.create({ email: 'viewer-language@example.com', password: 'secret123' });
		await viewer.allow('project.view');
		const project = await Project.create({
			name: 'Marketing site',
			slug: 'marketing-site',
			defaultLanguage: 'en',
		});
		await project.related('languages').create({ languageCode: 'en' });

		const response = await client
			.post('/projects/marketing-site/languages')
			.loginAs(viewer)
			.redirects(0)
			.withCsrfToken()
			.form({ language: 'fr' });

		response.assertStatus(403);

		await project.load('languages');
		assert.sameMembers(
			project.languages.map((language) => language.languageCode),
			['en'],
		);
	});

	test('removes a language from an existing project', async ({ client, assert }) => {
		const user = await createAuthorizedUser('manager-remove-language@example.com');
		const project = await Project.create({
			name: 'Marketing site',
			slug: 'marketing-site',
			defaultLanguage: 'en',
		});
		await project.related('languages').createMany([{ languageCode: 'en' }, { languageCode: 'fr' }]);

		const response = await client
			.delete('/projects/marketing-site/languages/fr')
			.loginAs(user)
			.redirects(0)
			.withCsrfToken();

		response.assertStatus(302);

		await project.load('languages');
		assert.sameMembers(
			project.languages.map((language) => language.languageCode),
			['en'],
		);
	});

	test('refuses to remove the default language', async ({ client, assert }) => {
		const user = await createAuthorizedUser('manager-remove-default@example.com');
		const project = await Project.create({
			name: 'Marketing site',
			slug: 'marketing-site',
			defaultLanguage: 'en',
		});
		await project.related('languages').createMany([{ languageCode: 'en' }, { languageCode: 'fr' }]);

		const response = await client
			.delete('/projects/marketing-site/languages/en')
			.loginAs(user)
			.redirects(0)
			.withCsrfToken();

		response.assertStatus(302);

		await project.load('languages');
		assert.sameMembers(
			project.languages.map((language) => language.languageCode),
			['en', 'fr'],
		);
	});

	test('rejects removing a language for a user without the project.manage permission', async ({ client, assert }) => {
		const viewer = await User.create({ email: 'viewer-remove-language@example.com', password: 'secret123' });
		await viewer.allow('project.view');
		const project = await Project.create({
			name: 'Marketing site',
			slug: 'marketing-site',
			defaultLanguage: 'en',
		});
		await project.related('languages').createMany([{ languageCode: 'en' }, { languageCode: 'fr' }]);

		const response = await client
			.delete('/projects/marketing-site/languages/fr')
			.loginAs(viewer)
			.redirects(0)
			.withCsrfToken();

		response.assertStatus(403);

		await project.load('languages');
		assert.sameMembers(
			project.languages.map((language) => language.languageCode),
			['en', 'fr'],
		);
	});

	test('changes the default language of a project', async ({ client, assert }) => {
		const user = await createAuthorizedUser('manager-set-default@example.com');
		const project = await Project.create({
			name: 'Marketing site',
			slug: 'marketing-site',
			defaultLanguage: 'en',
		});
		await project.related('languages').createMany([{ languageCode: 'en' }, { languageCode: 'fr' }]);

		const response = await client
			.put('/projects/marketing-site/languages/fr/default')
			.loginAs(user)
			.redirects(0)
			.withCsrfToken();

		response.assertStatus(302);

		await project.refresh();
		assert.equal(project.defaultLanguage, 'fr');
	});

	test('refuses to set a default language that is not part of the project', async ({ client, assert }) => {
		const user = await createAuthorizedUser('manager-set-bad-default@example.com');
		const project = await Project.create({
			name: 'Marketing site',
			slug: 'marketing-site',
			defaultLanguage: 'en',
		});
		await project.related('languages').create({ languageCode: 'en' });

		const response = await client
			.put('/projects/marketing-site/languages/de/default')
			.loginAs(user)
			.redirects(0)
			.withCsrfToken();

		response.assertStatus(302);

		await project.refresh();
		assert.equal(project.defaultLanguage, 'en');
	});

	test('rejects changing the default language for a user without the project.manage permission', async ({
		client,
		assert,
	}) => {
		const viewer = await User.create({ email: 'viewer-set-default@example.com', password: 'secret123' });
		await viewer.allow('project.view');
		const project = await Project.create({
			name: 'Marketing site',
			slug: 'marketing-site',
			defaultLanguage: 'en',
		});
		await project.related('languages').createMany([{ languageCode: 'en' }, { languageCode: 'fr' }]);

		const response = await client
			.put('/projects/marketing-site/languages/fr/default')
			.loginAs(viewer)
			.redirects(0)
			.withCsrfToken();

		response.assertStatus(403);

		await project.refresh();
		assert.equal(project.defaultLanguage, 'en');
	});
});
