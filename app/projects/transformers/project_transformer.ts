import { BaseTransformer } from '@adonisjs/core/transformers';
import drive from '@adonisjs/drive/services/main';

import type Project from '../models/project.ts';

export default class ProjectTransformer extends BaseTransformer<Project> {
	async toObject() {
		return {
			...this.pick(this.resource, ['id', 'name', 'slug', 'defaultLanguage', 'createdAt', 'updatedAt']),
			pictureUrl: this.resource.picture ? await drive.use().getUrl(this.resource.picture) : null,
		};
	}
}
