import { BaseTransformer } from '@adonisjs/core/transformers';
import type { PermissionInterface } from '@holoyan/adonisjs-permissions/types';

export default class PermissionTransformer extends BaseTransformer<PermissionInterface> {
	toObject() {
		return this.pick(this.resource, ['id', 'slug', 'title']);
	}
}
