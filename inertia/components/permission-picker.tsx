import { useMemo } from 'react';

import type { Data } from '#generated/data';

import { Checkbox } from '~/components/ui/checkbox';
import { Label } from '~/components/ui/label';
import { Separator } from '~/components/ui/separator';
import { groupPermissions } from '~/lib/permissions';

interface PermissionPickerProps {
	permissions: Data.Permissions.Permission[];
	value: string[];
	onValueChange: (next: string[]) => void;
}

export function PermissionPicker({ permissions, value, onValueChange }: PermissionPickerProps) {
	const groups = useMemo(() => groupPermissions(permissions), [permissions]);

	const toggle = (slug: string, checked: boolean) => {
		onValueChange(checked ? [...value, slug] : value.filter((item) => item !== slug));
	};

	const toggleGroup = (slugs: string[], checked: boolean) => {
		onValueChange(checked ? [...new Set([...value, ...slugs])] : value.filter((slug) => !slugs.includes(slug)));
	};

	return (
		<div className="flex max-h-72 flex-col gap-3 overflow-y-auto rounded-md border p-3">
			{groups.map((group, index) => {
				const groupSlugs = group.items.map((permission) => permission.slug);
				const allSelected = groupSlugs.every((slug) => value.includes(slug));

				return (
					<div key={group.name} className="flex flex-col gap-2">
						{index > 0 && <Separator />}

						<Label>
							<Checkbox checked={allSelected} onCheckedChange={(checked) => toggleGroup(groupSlugs, checked)} />

							{group.name}
						</Label>

						<div className="ml-6 flex flex-col gap-2">
							{group.items.map((permission) => (
								<Label key={permission.id} className="font-normal">
									<Checkbox
										name="permissions[]"
										value={permission.slug}
										checked={value.includes(permission.slug)}
										onCheckedChange={(checked) => toggle(permission.slug, checked)}
									/>

									{permission.title ?? permission.slug}
								</Label>
							))}
						</div>
					</div>
				);
			})}
		</div>
	);
}
