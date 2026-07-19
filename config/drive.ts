import { defineConfig, services } from '@adonisjs/drive';

import env from '#start/env';

const driveConfig = defineConfig({
	default: 's3',

	/**
	 * The services object can be used to configure multiple file system
	 * services each using the same or a different driver.
	 */
	services: {
		s3: services.s3({
			credentials: {
				accessKeyId: env.get('AWS_ACCESS_KEY_ID'),
				secretAccessKey: env.get('AWS_SECRET_ACCESS_KEY'),
			},
			region: env.get('AWS_REGION'),
			bucket: env.get('S3_BUCKET'),
			endpoint: env.get('S3_ENDPOINT'),
			forcePathStyle: Boolean(env.get('S3_ENDPOINT')),
			// MinIO does not support per-object ACLs; the bucket's own policy controls public access.
			supportsACL: !env.get('S3_ENDPOINT'),
			visibility: 'public',
		}),
	},
});

export default driveConfig;

declare module '@adonisjs/drive/types' {
	export interface DriveDisks extends InferDriveDisks<typeof driveConfig> {}
}
