import vine from '@vinejs/vine';

export const createRoleValidator = vine.create({
	name: vine.string().trim().minLength(2).maxLength(80),
	description: vine.string().trim().maxLength(500).optional(),
	permissions: vine.array(vine.string().trim()).minLength(1),
});
