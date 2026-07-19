import vine from '@vinejs/vine';

import { languageCodePattern } from './language_code.ts';

export const createProjectValidator = vine.create({
	name: vine.string().trim().minLength(2).maxLength(120),
	defaultLanguage: vine.string().trim().regex(languageCodePattern),
	picture: vine
		.file({
			size: '2mb',
			extnames: ['jpg', 'jpeg', 'png', 'webp'],
		})
		.optional(),
});

export const updateProjectValidator = vine.create({
	name: vine.string().trim().minLength(2).maxLength(120),
});
