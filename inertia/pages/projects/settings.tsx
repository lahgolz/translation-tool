import { Form, Link } from '@adonisjs/inertia/react';
import { Fragment } from 'react';

import type { Data } from '#generated/data';

import { ProjectLanguages } from '~/components/project-languages';
import { ProjectPictureDialog } from '~/components/project-picture-dialog';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '~/components/ui/breadcrumb';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '~/components/ui/field';
import { Input } from '~/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import type { InertiaProps } from '~/types';

type PageProps = InertiaProps<{
	project: Data.Projects.Project;
	breadcrumbs: { title: string; url: string; name?: string }[];
}>;

export default function ProjectsSettings({ project, breadcrumbs }: PageProps) {
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

			<div>
				<h1 className="font-heading text-2xl font-medium">Settings</h1>
				<p className="text-muted-foreground text-sm">{project.name}</p>
			</div>

			<Tabs defaultValue="general">
				<TabsList variant="line">
					<TabsTrigger value="general">General</TabsTrigger>
					<TabsTrigger value="languages">Languages</TabsTrigger>
				</TabsList>

				<TabsContent value="general">
					<Card>
						<CardHeader>
							<CardTitle>General</CardTitle>
							<CardDescription>Project name and picture.</CardDescription>
						</CardHeader>

						<CardContent className="flex flex-col gap-6">
							<ProjectPictureDialog project={project} />

							<Form route="projects.update" routeParams={{ slug: project.slug }}>
								{({ errors, processing }) => (
									<FieldGroup>
										<Field data-invalid={errors.name ? true : undefined}>
											<FieldLabel htmlFor="name">Name</FieldLabel>
											<Input
												id="name"
												name="name"
												defaultValue={project.name}
												aria-invalid={errors.name ? true : undefined}
											/>

											{errors.name && <FieldError>{errors.name}</FieldError>}
										</Field>

										<div className="self-start">
											<Button type="submit" disabled={processing}>
												Save changes
											</Button>
										</div>
									</FieldGroup>
								)}
							</Form>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="languages">
					<Card>
						<CardHeader>
							<CardTitle>Languages</CardTitle>
							<CardDescription>Languages available for translation in this project.</CardDescription>
						</CardHeader>

						<CardContent>
							<ProjectLanguages project={project} />
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
