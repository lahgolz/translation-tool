import { withAuthFinder } from '@adonisjs/auth/mixins/lucid';
import { compose } from '@adonisjs/core/helpers';
import hash from '@adonisjs/core/services/hash';
import { hasPermissions, MorphMap } from '@holoyan/adonisjs-permissions';
import type { AclModelInterface } from '@holoyan/adonisjs-permissions/types';

import { UserSchema } from '#database/schema';

@MorphMap('users')
export default class User
	extends compose(UserSchema, withAuthFinder(hash), hasPermissions())
	implements AclModelInterface
{
	getModelId() {
		return this.id;
	}
}
