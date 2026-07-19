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
			.form({ name: 'Marketing site', defaultLanguage: 'en' });

		response.assertHeader('location', '/projects/marketing-site');

		const project = await Project.findByOrFail('slug', 'marketing-site');
		assert.equal(project.name, 'Marketing site');
		assert.equal(project.defaultLanguage, 'en');
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
			.form({ name: 'Marketing site', defaultLanguage: 'en' });
		await client
			.post('/projects')
			.loginAs(user)
			.withCsrfToken()
			.form({ name: 'Marketing site', defaultLanguage: 'fr' });

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
			.form({ name: 'Marketing site', defaultLanguage: 'en' });

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
				defaultLanguage: 'The defaultLanguage field must be defined',
			},
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
});
