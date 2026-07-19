import vine from '@vinejs/vine';

export const uploadProjectPictureValidator = vine.create({
	picture: vine.file({
		size: '2mb',
		extnames: ['jpg', 'jpeg', 'png', 'webp'],
	}),
});
