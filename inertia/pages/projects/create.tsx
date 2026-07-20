import { Form } from '@adonisjs/inertia/react';
import { Modal } from 'adonis-inertia-modal/react';
import { XIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { FlagIcon } from '~/components/flag-icon';
import { Button } from '~/components/ui/button';
import {
	Combobox,
	ComboboxChip,
	ComboboxChips,
	ComboboxChipsInput,
	ComboboxCollection,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxGroup,
	ComboboxItem,
	ComboboxLabel,
	ComboboxList,
	ComboboxValue,
	useComboboxAnchor,
} from '~/components/ui/combobox';
import { Field, FieldError, FieldGroup, FieldLabel } from '~/components/ui/field';
import { Input } from '~/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { formatLanguageLabel, LANGUAGE_GROUPS, matchesLanguageQuery, type LanguageOption } from '~/lib/languages';

export default function ProjectsCreate() {
	const [languages, setLanguages] = useState<LanguageOption[]>([]);
	const [defaultLanguage, setDefaultLanguage] = useState<string | undefined>(undefined);
	const chipsAnchor = useComboboxAnchor();
	const rootRef = useRef<HTMLDivElement>(null);
	const [modalContainer, setModalContainer] = useState<HTMLElement | null>(null);
	const filePickerGraceRef = useRef(false);
	const dialogNodeRef = useRef<HTMLDialogElement | null>(null);

	useEffect(() => {
		setModalContainer(rootRef.current?.closest<HTMLElement>('.im-panel') ?? null);
		dialogNodeRef.current = rootRef.current?.closest<HTMLDialogElement>('dialog') ?? null;
	}, []);

	useEffect(() => {
		const guardIfSpurious = (event: Event) => {
			if (filePickerGraceRef.current && event.target === dialogNodeRef.current) {
				event.stopPropagation();
			}
		};

		const armGraceTimeout = () => {
			if (!filePickerGraceRef.current) {
				return;
			}

			setTimeout(() => {
				filePickerGraceRef.current = false;
			}, 400);
		};

		document.addEventListener('click', guardIfSpurious, true);
		document.addEventListener('cancel', guardIfSpurious, true);
		window.addEventListener('focus', armGraceTimeout);

		return () => {
			document.removeEventListener('click', guardIfSpurious, true);
			document.removeEventListener('cancel', guardIfSpurious, true);
			window.removeEventListener('focus', armGraceTimeout);
		};
	}, []);

	const handleLanguagesChange = (next: LanguageOption[]) => {
		setLanguages(next);
		setDefaultLanguage((current) =>
			current && next.some((language) => language.code === current) ? current : next[0]?.code,
		);
	};

	return (
		<Modal closeButton={false}>
			{({ close }) => (
				<Form route="projects.store">
					{({ errors, processing }) => (
						<div ref={rootRef} className="flex flex-col gap-6">
							<div>
								<h2 className="font-heading leading-none font-medium">New project</h2>
								<p className="text-muted-foreground mt-2 text-sm">Set the project name and its languages.</p>
							</div>

							<FieldGroup>
								<Field data-invalid={errors.name ? true : undefined}>
									<FieldLabel htmlFor="name">Name</FieldLabel>
									<Input id="name" name="name" aria-invalid={errors.name ? true : undefined} />
									{errors.name && <FieldError>{errors.name}</FieldError>}
								</Field>

								<Field data-invalid={errors.languages ? true : undefined}>
									<FieldLabel htmlFor="languages">Languages</FieldLabel>
									<Combobox
										multiple
										autoHighlight
										name="languages[]"
										items={LANGUAGE_GROUPS}
										value={languages}
										onValueChange={handleLanguagesChange}
										filter={(language: LanguageOption, query: string) => matchesLanguageQuery(language, query)}
										itemToStringLabel={(language: LanguageOption) => formatLanguageLabel(language)}
										itemToStringValue={(language: LanguageOption) => language.code}
									>
										<ComboboxChips ref={chipsAnchor}>
											<ComboboxValue>
												{(values: LanguageOption[]) => (
													<>
														{values.map((language) => (
															<ComboboxChip key={language.code}>
																<FlagIcon countryCode={language.countryCode} />
																{formatLanguageLabel(language)}
															</ComboboxChip>
														))}
														<ComboboxChipsInput
															id="languages"
															placeholder={values.length ? undefined : 'Search by code, language or country…'}
															aria-invalid={errors.languages ? true : undefined}
														/>
													</>
												)}
											</ComboboxValue>
										</ComboboxChips>

										<ComboboxContent anchor={chipsAnchor} container={modalContainer ?? undefined}>
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

									{errors.languages && <FieldError>{errors.languages}</FieldError>}
								</Field>

								<Field data-invalid={errors.defaultLanguage ? true : undefined}>
									<FieldLabel htmlFor="defaultLanguage">Default language</FieldLabel>
									<Select
										name="defaultLanguage"
										disabled={languages.length === 0}
										value={languages.find((language) => language.code === defaultLanguage) ?? null}
										onValueChange={(language: LanguageOption | null) => setDefaultLanguage(language?.code)}
										itemToStringLabel={(language: LanguageOption) => formatLanguageLabel(language)}
										itemToStringValue={(language: LanguageOption) => language.code}
									>
										<SelectTrigger id="defaultLanguage" aria-invalid={errors.defaultLanguage ? true : undefined}>
											<SelectValue placeholder="Select a default language" />
										</SelectTrigger>

										<SelectContent container={modalContainer ?? undefined}>
											<SelectGroup>
												{languages.map((language) => (
													<SelectItem key={language.code} value={language}>
														<FlagIcon countryCode={language.countryCode} />
														{formatLanguageLabel(language)}
													</SelectItem>
												))}
											</SelectGroup>
										</SelectContent>
									</Select>

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
										onClick={() => {
											filePickerGraceRef.current = true;
										}}
									/>

									{errors.picture && <FieldError>{errors.picture}</FieldError>}
								</Field>
							</FieldGroup>

							<div className="flex justify-end">
								<Button type="submit" disabled={processing || languages.length === 0}>
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
