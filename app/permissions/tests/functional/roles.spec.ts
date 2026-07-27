import testUtils from '@adonisjs/core/services/test_utils';
import { Acl } from '@holoyan/adonisjs-permissions';
import { test } from '@japa/runner';

import Role from '#permissions/models/role';
import User from '#users/models/user';

async function createAuthorizedUser(email: string) {
	const user = await User.create({ email, password: 'secret123' });
	await user.allow('members.manage');

	return user;
}

async function createPermission(slug: string, title: string) {
	return Acl.permission().create({ slug, title });
}

test.group('Roles admin', (group) => {
	group.each.setup(async () => testUtils.db().wrapInGlobalTransaction());

	test('requires authentication to list roles', async ({ client }) => {
		const response = await client.get('/admin/roles').redirects(0);

		response.assertHeader('location', '/login');
	});

	test('rejects a user without the members.manage permission from the list', async ({ client }) => {
		const user = await User.create({ email: 'no-access@example.com', password: 'secret123' });

		const response = await client.get('/admin/roles').loginAs(user);

		response.assertStatus(403);
	});

	test('lists a role with its assigned permissions', async ({ client }) => {
		const user = await createAuthorizedUser('manager@example.com');
		const permission = await createPermission('project.view', 'View projects');
		const role = await Acl.role().create({ slug: 'custom-role', title: 'Custom role' });

		await Role.query().where('id', role.id).update({ description: 'A custom role', isSystem: false });
		await Acl.role(role).sync([permission.slug]);

		const response = await client.get('/admin/roles').loginAs(user).withInertia();

		response.assertStatus(200);
		response.assertInertiaComponent('admin/roles/index');
		response.assertInertiaPropsContains({
			roles: [
				{
					slug: 'custom-role',
					title: 'Custom role',
					description: 'A custom role',
					isSystem: false,
					permissions: [{ slug: 'project.view', title: 'View projects' }],
				},
			],
		});
	});

	test('opens the create role modal for an authorized user', async ({ client }) => {
		const user = await createAuthorizedUser('manager-create@example.com');

		const response = await client.get('/admin/roles/create').loginAs(user);

		response.assertStatus(200);
	});

	test('rejects the create role modal for a user without the members.manage permission', async ({ client }) => {
		const user = await User.create({ email: 'no-access-create@example.com', password: 'secret123' });

		const response = await client.get('/admin/roles/create').loginAs(user);

		response.assertStatus(403);
	});

	test('creates a custom role with the selected permissions', async ({ client, assert }) => {
		const user = await createAuthorizedUser('manager2@example.com');

		await createPermission('project.view', 'View projects');
		await createPermission('project.manage', 'Manage projects');

		const response = await client
			.post('/admin/roles')
			.loginAs(user)
			.redirects(0)
			.withCsrfToken()
			.form({
				name: 'Localization Lead',
				description: 'Leads localization efforts',
				'permissions[]': ['project.view'],
			});

		response.assertHeader('location', '/admin/roles');

		const role = await Role.findByOrFail('slug', 'localization-lead');

		assert.equal(role.title, 'Localization Lead');
		assert.equal(role.description, 'Leads localization efforts');
		assert.isFalse(role.isSystem);

		const permissions = await Acl.role(role).permissions();

		assert.sameMembers(
			permissions.map((permission) => permission.slug),
			['project.view'],
		);
	});

	test('only assigns permissions that exist', async ({ client, assert }) => {
		const user = await createAuthorizedUser('manager-unknown-permission@example.com');

		await createPermission('project.view', 'View projects');

		await client
			.post('/admin/roles')
			.loginAs(user)
			.redirects(0)
			.withCsrfToken()
			.form({ name: 'Ghost role', 'permissions[]': ['project.view', 'not.a.real.permission'] });

		const role = await Role.findByOrFail('slug', 'ghost-role');
		const permissions = await Acl.role(role).permissions();

		assert.sameMembers(
			permissions.map((permission) => permission.slug),
			['project.view'],
		);
	});

	test('generates a unique slug when role names collide', async ({ client, assert }) => {
		const user = await createAuthorizedUser('manager3@example.com');
		await createPermission('project.view', 'View projects');

		await client
			.post('/admin/roles')
			.loginAs(user)
			.withCsrfToken()
			.form({ name: 'Localization Lead', 'permissions[]': ['project.view'] });
		await client
			.post('/admin/roles')
			.loginAs(user)
			.withCsrfToken()
			.form({ name: 'Localization Lead', 'permissions[]': ['project.view'] });

		const roles = await Role.query().where('title', 'Localization Lead').orderBy('id', 'asc');

		assert.lengthOf(roles, 2);
		assert.equal(roles[0].slug, 'localization-lead');
		assert.equal(roles[1].slug, 'localization-lead-2');
	});

	test('rejects role creation for a user without the members.manage permission', async ({ client }) => {
		const user = await User.create({ email: 'no-access-store@example.com', password: 'secret123' });

		const response = await client
			.post('/admin/roles')
			.loginAs(user)
			.redirects(0)
			.withCsrfToken()
			.form({ name: 'Localization Lead', 'permissions[]': ['project.view'] });

		response.assertStatus(403);
	});

	test('validates role creation input', async ({ client }) => {
		const user = await createAuthorizedUser('manager4@example.com');

		const response = await client
			.post('/admin/roles')
			.loginAs(user)
			.withInertia()
			.withCsrfToken()
			.header('referer', '/admin/roles/create')
			.json({ name: '', permissions: [] });

		response.assertInertiaPropsContains({
			errors: {
				name: 'The name field must be defined',
				permissions: 'The permissions field must have at least 1 items',
			},
		});
	});

	test('deletes a custom role', async ({ client, assert }) => {
		const user = await createAuthorizedUser('manager5@example.com');
		const role = await Acl.role().create({ slug: 'custom-role-2', title: 'Custom role 2' });

		await Role.query().where('id', role.id).update({ isSystem: false });

		const response = await client.delete('/admin/roles/custom-role-2').loginAs(user).redirects(0).withCsrfToken();

		response.assertHeader('location', '/admin/roles');

		const deleted = await Role.findBy('slug', 'custom-role-2');
		assert.isNull(deleted);
	});

	test('refuses to delete a default role', async ({ client, assert }) => {
		const user = await createAuthorizedUser('manager6@example.com');
		const role = await Acl.role().create({ slug: 'system-role', title: 'System role' });

		await Role.query().where('id', role.id).update({ isSystem: true });

		const response = await client.delete('/admin/roles/system-role').loginAs(user).redirects(0).withCsrfToken();

		response.assertStatus(403);

		const stillExists = await Role.findBy('slug', 'system-role');
		assert.isNotNull(stillExists);
	});

	test('rejects deleting a role for a user without the members.manage permission', async ({ client }) => {
		const user = await User.create({ email: 'no-access-destroy@example.com', password: 'secret123' });
		const role = await Acl.role().create({ slug: 'custom-role-3', title: 'Custom role 3' });

		await Role.query().where('id', role.id).update({ isSystem: false });

		const response = await client.delete('/admin/roles/custom-role-3').loginAs(user).redirects(0).withCsrfToken();

		response.assertStatus(403);
	});
});
