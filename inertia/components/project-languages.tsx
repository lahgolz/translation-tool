import { Form } from '@adonisjs/inertia/react';
import { useState } from 'react';

import type { Data } from '#generated/data';

import { FlagIcon } from '~/components/flag-icon';
import { LanguageListItem } from '~/components/language-list-item';
import { Button } from '~/components/ui/button';
import {
	Combobox,
	ComboboxCollection,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxGroup,
	ComboboxInput,
	ComboboxItem,
	ComboboxLabel,
	ComboboxList,
} from '~/components/ui/combobox';
import { Field, FieldError, FieldGroup, FieldLabel } from '~/components/ui/field';
import {
	formatLanguageLabel,
	groupLanguages,
	LANGUAGES,
	matchesLanguageQuery,
	sortProjectLanguages,
	type LanguageOption,
} from '~/lib/languages';

export function ProjectLanguages({ project }: { project: Data.Projects.Project }) {
	const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption | null>(null);

	const availableLanguageGroups = groupLanguages(
		LANGUAGES.filter((language) => !project.languages.includes(language.code)),
	);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-3">
				{sortProjectLanguages(project.languages, project.defaultLanguage).map((code) => (
					<LanguageListItem key={code} project={project} code={code} />
				))}
			</div>

			<Form
				route="projects.languages.store"
				routeParams={{ slug: project.slug }}
				options={{ preserveState: true, preserveScroll: true }}
				onSuccess={() => setSelectedLanguage(null)}
			>
				{({ errors, processing }) => (
					<FieldGroup>
						<Field data-invalid={errors.language ? true : undefined}>
							<FieldLabel htmlFor="language">Add a language</FieldLabel>
							<Combobox
								autoHighlight
								name="language"
								items={availableLanguageGroups}
								value={selectedLanguage}
								onValueChange={setSelectedLanguage}
								filter={(language, query) => matchesLanguageQuery(language, query)}
								itemToStringLabel={(language) => `${language.name} (${language.code})`}
								itemToStringValue={(language) => language.code}
							>
								<ComboboxInput
									id="language"
									placeholder="Search by code, language or country…"
									aria-invalid={errors.language ? true : undefined}
								/>
								<ComboboxContent>
									<ComboboxEmpty>No languages found.</ComboboxEmpty>
									<ComboboxList>
										{(group) => (
											<ComboboxGroup key={group.name} items={group.items}>
												<ComboboxLabel>{group.name}</ComboboxLabel>
												<ComboboxCollection>
													{(language: LanguageOption) => (
														<ComboboxItem key={language.code} value={language}>
															<FlagIcon countryCode={language.countryCode} />
															{formatLanguageLabel(language)}
														</ComboboxItem>
													)}
												</ComboboxCollection>
											</ComboboxGroup>
										)}
									</ComboboxList>
								</ComboboxContent>
							</Combobox>
							{errors.language && <FieldError>{errors.language}</FieldError>}
						</Field>

						<div className="self-start">
							<Button type="submit" disabled={processing || !selectedLanguage}>
								Add language
							</Button>
						</div>
					</FieldGroup>
				)}
			</Form>
		</div>
	);
}
