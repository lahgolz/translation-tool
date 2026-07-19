import { Form } from '@adonisjs/inertia/react';
import { Modal } from 'adonis-inertia-modal/react';
import { XIcon } from 'lucide-react';

import { Button } from '~/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '~/components/ui/field';
import { Input } from '~/components/ui/input';

export default function ProjectsCreate() {
	return (
		<Modal closeButton={false}>
			{({ close }) => (
				<Form route="projects.store">
					{({ errors, processing }) => (
						<div className="flex flex-col gap-6">
							<div>
								<h2 className="font-heading leading-none font-medium">New project</h2>
								<p className="text-muted-foreground mt-2 text-sm">Set the project name and its default language.</p>
							</div>

							<FieldGroup>
								<Field data-invalid={errors.name ? true : undefined}>
									<FieldLabel htmlFor="name">Name</FieldLabel>
									<Input id="name" name="name" aria-invalid={errors.name ? true : undefined} />
									{errors.name && <FieldError>{errors.name}</FieldError>}
								</Field>

								<Field data-invalid={errors.defaultLanguage ? true : undefined}>
									<FieldLabel htmlFor="defaultLanguage">Default language</FieldLabel>
									<Input
										id="defaultLanguage"
										name="defaultLanguage"
										placeholder="en"
										aria-invalid={errors.defaultLanguage ? true : undefined}
									/>
									{errors.defaultLanguage && <FieldError>{errors.defaultLanguage}</FieldError>}
								</Field>

								<Field data-invalid={errors.picture ? true : undefined}>
									<FieldLabel htmlFor="picture">Picture</FieldLabel>
									<Input
										id="picture"
										name="picture"
										type="file"
										accept="image/png,image/jpeg,image/webp"
										aria-invalid={errors.picture ? true : undefined}
									/>
									{errors.picture && <FieldError>{errors.picture}</FieldError>}
								</Field>
							</FieldGroup>

							<div className="flex justify-end">
								<Button type="submit" disabled={processing}>
									Create project
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
