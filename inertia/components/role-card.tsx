import { useRouter } from '@adonisjs/inertia/react';
import { Trash2Icon } from 'lucide-react';
import { useState } from 'react';

import type { Data } from '#generated/data';

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '~/components/ui/alert-dialog';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';

export function RoleCard({ role }: { role: Data.Permissions.Role }) {
	const router = useRouter();

	const [deleteOpen, setDeleteOpen] = useState(false);
	const [deleting, setDeleting] = useState(false);

	const handleDelete = () => {
		setDeleting(true);

		router.visit(
			{ route: 'admin.roles.destroy', routeParams: { slug: role.slug } },
			{
				method: 'delete',
				preserveScroll: true,
				onSuccess: () => setDeleteOpen(false),
				onFinish: () => setDeleting(false),
			},
		);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					{role.title}

					<Badge variant={role.isSystem ? 'secondary' : 'outline'}>{role.isSystem ? 'Default' : 'Custom'}</Badge>
				</CardTitle>

				{role.description && <CardDescription>{role.description}</CardDescription>}

				<CardAction className="flex items-center gap-2">
					{!role.isSystem && (
						<AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
							<AlertDialogTrigger render={<Button variant="ghost" size="icon-sm" />}>
								<Trash2Icon />
								<span className="sr-only">Delete role</span>
							</AlertDialogTrigger>

							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Delete {role.title}?</AlertDialogTitle>
									<AlertDialogDescription>
										This removes the role from anyone it's assigned to. This can't be undone.
									</AlertDialogDescription>
								</AlertDialogHeader>

								<AlertDialogFooter>
									<AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
									<AlertDialogAction variant="destructive" disabled={deleting} onClick={handleDelete}>
										Delete role
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					)}

					{role.permissions.length === 0 ? (
						<span className="text-muted-foreground text-sm">No permissions</span>
					) : (
						<Popover>
							<PopoverTrigger render={<Button variant="outline" size="sm" />}>
								{role.permissions.length} permission{role.permissions.length === 1 ? '' : 's'}
							</PopoverTrigger>

							<PopoverContent className="flex flex-wrap gap-1.5">
								{role.permissions.map((permission) => (
									<Badge key={permission.id} variant="outline">
										{permission.title ?? permission.slug}
									</Badge>
								))}
							</PopoverContent>
						</Popover>
					)}
				</CardAction>
			</CardHeader>
		</Card>
	);
}
