import vine from '@vinejs/vine';

import { languageCodePattern } from './language_code.ts';

export const addProjectLanguageValidator = vine.create({
	language: vine.string().trim().regex(languageCodePattern),
});
