import { Link } from '@adonisjs/inertia/react';
import { usePage } from '@inertiajs/react';
import { SettingsIcon } from 'lucide-react';
import { Fragment } from 'react';

import type { Data } from '#generated/data';

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '~/components/ui/breadcrumb';
import { Button } from '~/components/ui/button';
import type { InertiaProps } from '~/types';

type PageProps = InertiaProps<{
	project: Data.Projects.Project;
	breadcrumbs: { title: string; url: string; name?: string }[];
}>;

export default function ProjectsShow({ project, breadcrumbs }: PageProps) {
	const { canManageProjects } = usePage<InertiaProps>().props;

	return (
		<div className="mx-auto flex max-w-4xl flex-col gap-6 p-6">
			<Breadcrumb>
				<BreadcrumbList>
					{breadcrumbs.map((crumb, index) => (
						<Fragment key={crumb.url}>
							<BreadcrumbItem>
								{index === breadcrumbs.length - 1 ? (
									<BreadcrumbPage>{crumb.title}</BreadcrumbPage>
								) : (
									<BreadcrumbLink render={<Link href={crumb.url} />}>{crumb.title}</BreadcrumbLink>
								)}
							</BreadcrumbItem>
							{index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
						</Fragment>
					))}
				</BreadcrumbList>
			</Breadcrumb>

			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					{project.pictureUrl ? (
						<img src={project.pictureUrl} alt="" data-slot="project-picture" className="size-10 rounded object-cover" />
					) : (
						<div className="bg-muted size-10 rounded" />
					)}

					<div>
						<h1 className="font-heading text-2xl font-medium">{project.name}</h1>
						<p className="text-muted-foreground text-sm">{project.slug}</p>
					</div>
				</div>

				{canManageProjects && (
					<Button variant="outline" render={<Link route="projects.settings" routeParams={{ slug: project.slug }} />}>
						<SettingsIcon data-icon="inline-start" />
						Settings
					</Button>
				)}
			</div>
		</div>
	);
}
