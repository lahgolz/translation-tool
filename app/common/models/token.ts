import { belongsTo } from '@adonisjs/lucid/orm';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';

import { TokenSchema } from '#database/schema';
import User from '#users/models/user';

export const TokenType = {
	PasswordReset: 'password_reset',
} as const;

export type TokenType = (typeof TokenType)[keyof typeof TokenType];

export default class Token extends TokenSchema {
	declare type: TokenType;

	@belongsTo(() => User)
	declare user: BelongsTo<typeof User>;
}
