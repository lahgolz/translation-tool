import vine from '@vinejs/vine';

export const loginValidator = vine.create({
	email: vine.string().email(),
	password: vine.string(),
});

export const forgotPasswordValidator = vine.create({
	email: vine.string().trim().email(),
});

export const resetPasswordValidator = vine.create({
	token: vine.string(),
	password: vine.string().minLength(8).confirmed(),
});
