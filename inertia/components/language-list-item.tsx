import { useRouter } from '@adonisjs/inertia/react';
import { StarIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';

import type { Data } from '#generated/data';

import { FlagIcon } from '~/components/flag-icon';
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
import { Button } from '~/components/ui/button';
import { Card, CardAction, CardHeader, CardTitle } from '~/components/ui/card';
import { findLanguage, formatLanguageLabel } from '~/lib/languages';

export function LanguageListItem({ project, code }: { project: Data.Projects.Project; code: string }) {
	const router = useRouter();

	const [deleteOpen, setDeleteOpen] = useState(false);
	const [deleting, setDeleting] = useState(false);
	const [settingDefault, setSettingDefault] = useState(false);

	const isDefault = code === project.defaultLanguage;
	const language = findLanguage(code);
	const label = language ? formatLanguageLabel(language) : code;

	const handleDelete = () => {
		setDeleting(true);

		router.visit(
			{ route: 'projects.languages.destroy', routeParams: { slug: project.slug, language: code } },
			{
				method: 'delete',
				preserveScroll: true,
				preserveState: true,
				onSuccess: () => setDeleteOpen(false),
				onFinish: () => setDeleting(false),
			},
		);
	};

	const handleSetDefault = () => {
		setSettingDefault(true);

		router.visit(
			{ route: 'projects.languages.default', routeParams: { slug: project.slug, language: code } },
			{
				method: 'put',
				preserveScroll: true,
				preserveState: true,
				onFinish: () => setSettingDefault(false),
			},
		);
	};

	return (
		<Card size="sm">
			<CardHeader>
				<div className="flex items-center gap-3">
					{language ? (
						<FlagIcon countryCode={language.countryCode} className="h-8 w-11 rounded-md" />
					) : (
						<div className="bg-muted h-8 w-11 rounded-md" />
					)}

					<CardTitle className="min-w-0">
						<span className="block truncate">{label}</span>
					</CardTitle>
				</div>

				<CardAction className="flex items-center gap-1">
					{isDefault ? (
						<span className="text-muted-foreground text-xs">Default</span>
					) : (
						<>
							<Button variant="ghost" size="icon-xs" onClick={handleSetDefault} disabled={settingDefault}>
								<StarIcon className="pointer-events-none" />
								<span className="sr-only">Set {label} as default</span>
							</Button>

							<AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
								<AlertDialogTrigger render={<Button variant="ghost" size="icon-xs" />}>
									<Trash2Icon className="pointer-events-none" />
									<span className="sr-only">Remove {label}</span>
								</AlertDialogTrigger>

								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>Remove {label}?</AlertDialogTitle>
										<AlertDialogDescription>
											This removes the language from the project. This can't be undone.
										</AlertDialogDescription>
									</AlertDialogHeader>

									<AlertDialogFooter>
										<AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
										<AlertDialogAction variant="destructive" disabled={deleting} onClick={handleDelete}>
											Remove
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</>
					)}
				</CardAction>
			</CardHeader>
		</Card>
	);
}
