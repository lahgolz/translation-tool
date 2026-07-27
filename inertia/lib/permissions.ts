import type { Data } from '#generated/data';

export interface PermissionGroup {
	name: string;
	items: Data.Permissions.Permission[];
}

const CATEGORY_LABELS: Record<string, string> = {
	project: 'Projects',
	members: 'Members',
};

export function permissionCategory(slug: string) {
	const prefix = slug.split('.')[0] ?? slug;

	return CATEGORY_LABELS[prefix] ?? prefix;
}

export function groupPermissions(permissions: Data.Permissions.Permission[]): PermissionGroup[] {
	const groups = new Map<string, Data.Permissions.Permission[]>();

	for (const permission of permissions) {
		const category = permissionCategory(permission.slug);
		const group = groups.get(category);

		if (group) {
			group.push(permission);
		} else {
			groups.set(category, [permission]);
		}
	}

	return [...groups.entries()].map(([name, items]) => ({ name, items }));
}
