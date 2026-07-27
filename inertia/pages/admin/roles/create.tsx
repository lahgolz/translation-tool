import { Form } from '@adonisjs/inertia/react';
import { Modal } from 'adonis-inertia-modal/react';
import { XIcon } from 'lucide-react';
import { useState } from 'react';

import type { Data } from '#generated/data';

import { PermissionPicker } from '~/components/permission-picker';
import { Button } from '~/components/ui/button';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '~/components/ui/field';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import type { InertiaProps } from '~/types';

type PageProps = InertiaProps<{ permissions: Data.Permissions.Permission[] }>;

export default function AdminRolesCreate({ permissions }: PageProps) {
	const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

	return (
		<Modal closeButton={false}>
			{({ close }) => (
				<Form route="admin.roles.store" onSuccess={close}>
					{({ errors, processing }) => (
						<div className="flex flex-col gap-6">
							<div>
								<h2 className="font-heading leading-none font-medium">New role</h2>
								<p className="text-muted-foreground mt-2 text-sm">
									Name the role and choose the permissions it grants.
								</p>
							</div>

							<FieldGroup>
								<Field data-invalid={errors.name ? true : undefined}>
									<FieldLabel htmlFor="name">Name</FieldLabel>
									<Input id="name" name="name" aria-invalid={errors.name ? true : undefined} />
									{errors.name && <FieldError>{errors.name}</FieldError>}
								</Field>

								<Field data-invalid={errors.description ? true : undefined}>
									<FieldLabel htmlFor="description">Description</FieldLabel>
									<Textarea id="description" name="description" aria-invalid={errors.description ? true : undefined} />
									{errors.description && <FieldError>{errors.description}</FieldError>}
								</Field>

								<Field data-invalid={errors.permissions ? true : undefined}>
									<FieldLabel htmlFor="permissions">Permissions</FieldLabel>
									<FieldDescription>
										Check individual permissions, or a group header to select the whole group.
									</FieldDescription>
									<PermissionPicker
										permissions={permissions}
										value={selectedPermissions}
										onValueChange={setSelectedPermissions}
									/>
									{errors.permissions && <FieldError>{errors.permissions}</FieldError>}
								</Field>
							</FieldGroup>

							<div className="flex justify-end">
								<Button type="submit" disabled={processing || selectedPermissions.length === 0}>
									Create role
								</Button>
							</div>

							<Button type="button" variant="ghost" size="icon-sm" className="absolute top-4 right-4" onClick={close}>
								<XIcon />
								<span className="sr-only">Close</span>
							</Button>
						</div>
					)}
				</Form>
			)}
		</Modal>
	);
}
