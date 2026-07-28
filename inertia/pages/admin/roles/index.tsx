import { ModalLink } from 'adonis-inertia-modal/react';

import type { Data } from '#generated/data';

import { RoleCard } from '~/components/role-card';
import { Button } from '~/components/ui/button';
import type { InertiaProps } from '~/types';

type PageProps = InertiaProps<{
	roles: Data.Permissions.Role[];
}>;

export default function AdminRolesIndex({ roles }: PageProps) {
	return (
		<div className="mx-auto flex max-w-4xl flex-col gap-6 p-6">
			<div className="flex flex-col gap-3 sm:flex-row sm:gap-0 items-center justify-between">
				<div>
					<h1 className="font-heading text-2xl font-medium">Roles & permissions</h1>
					<p className="text-muted-foreground text-sm">
						Default roles ship with the product. Create custom roles for anything else your team needs.
					</p>
				</div>

				<ModalLink href="/admin/roles/create" className="ml-auto" as={Button}>
					New role
				</ModalLink>
			</div>

			<div className="flex flex-col gap-4">
				{roles.map((role) => (
					<RoleCard key={role.id} role={role} />
				))}
			</div>
		</div>
	);
}
