import { Link } from '@adonisjs/inertia/react';
import { usePage } from '@inertiajs/react';
import { ModalLink } from 'adonis-inertia-modal/react';
import { EllipsisVerticalIcon, SettingsIcon } from 'lucide-react';

import type { Data } from '#generated/data';

import { FlagIcon } from '~/components/flag-icon';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '~/components/ui/empty';
import { findLanguage, formatLanguageLabel, sortProjectLanguages } from '~/lib/languages';
import type { InertiaProps } from '~/types';

type PageProps = InertiaProps<{ projects: Data.Projects.Project[] }>;

export default function ProjectsIndex({ projects }: PageProps) {
	const { canManageProjects } = usePage<InertiaProps>().props;

	return (
		<div className="mx-auto flex max-w-4xl flex-col gap-6 p-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-heading text-2xl font-medium">Projects</h1>
					<p className="text-muted-foreground text-sm">Top-level boundaries for source content and translations.</p>
				</div>

				<ModalLink href="/projects/create" as={Button}>
					New project
				</ModalLink>
			</div>

			{projects.length === 0 ? (
				<Empty>
					<EmptyHeader>
						<EmptyTitle>No projects yet</EmptyTitle>
						<EmptyDescription>
							Create your first project to start adding source content and translations.
						</EmptyDescription>
					</EmptyHeader>
				</Empty>
			) : (
				<div className="flex flex-col gap-4">
					{projects.map((project) => (
						<div key={project.id} className="relative">
							<Card className="flex flex-row gap-0">
								<div className="absolute inset-0 [&>a]:block [&>a]:size-full">
									<Link route="projects.show" routeParams={{ slug: project.slug }} aria-label={project.name} />
								</div>

								<CardHeader className="max-w-content flex-1 gap-3">
									<div className="flex items-center gap-3">
										{project.pictureUrl ? (
											<img src={project.pictureUrl} alt="" className="size-14 rounded object-cover" />
										) : (
											<div className="bg-muted size-14 rounded" />
										)}

										<div className="min-w-0">
											<CardTitle>
												<span className="block truncate">{project.name}</span>
											</CardTitle>
											<p className="text-muted-foreground truncate text-sm">{project.slug}</p>
										</div>
									</div>
								</CardHeader>

								<CardContent className="max-w-content right-8 flex flex-0">
									<div className="flex items-center gap-1">
										{sortProjectLanguages(project.languages, project.defaultLanguage).map((code) => {
											const language = findLanguage(code);

											return language ? (
												<span key={code} title={formatLanguageLabel(language)}>
													<FlagIcon countryCode={language.countryCode} className="h-5 w-8 rounded-md" />
												</span>
											) : null;
										})}
									</div>

									{canManageProjects && (
										<div className="w-8">
											<div className="absolute top-4 right-4 z-10">
												<DropdownMenu>
													<DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
														<EllipsisVerticalIcon />
														<span className="sr-only">Project actions</span>
													</DropdownMenuTrigger>

													<DropdownMenuContent align="end">
														<DropdownMenuGroup>
															<DropdownMenuItem
																render={<Link route="projects.settings" routeParams={{ slug: project.slug }} />}
															>
																<SettingsIcon />
																Settings
															</DropdownMenuItem>
														</DropdownMenuGroup>
													</DropdownMenuContent>
												</DropdownMenu>
											</div>
										</div>
									)}
								</CardContent>
							</Card>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
