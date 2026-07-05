import { randomBytes, createHash } from 'node:crypto';

import { urlFor } from '@adonisjs/core/services/url_builder';
import mail from '@adonisjs/mail/services/main';
import { DateTime } from 'luxon';

import ResetPasswordNotification from '#mails/reset_password_notification';
import Token, { TokenType } from '#models/token';
import User from '#models/user';
import env from '#start/env';

const TOKEN_TTL_MINUTES = 60;

function hashToken(rawToken: string) {
	return createHash('sha256').update(rawToken).digest('hex');
}

export class PasswordResetService {
	/**
	 * Sends a reset email when an account exists for the given address.
	 * Silently no-ops otherwise, so callers can respond the same way
	 * regardless of whether the account exists.
	 */
	async requestReset(email: string) {
		const user = await User.findBy('email', email);

		if (!user) {
			return;
		}

		const token = await this.generateFor(user);
		const resetUrl = urlFor('password_resets.edit', { token }, { prefixUrl: env.get('APP_URL') });

		await mail.sendLater(new ResetPasswordNotification(user, resetUrl));
	}

	/**
	 * Consumes a reset token and applies the new password. Returns whether
	 * the token was valid.
	 */
	async resetPassword(rawToken: string, newPassword: string) {
		const user = await this.consume(rawToken);

		if (!user) {
			return false;
		}

		user.password = newPassword;
		await user.save();

		return true;
	}

	/**
	 * Invalidates any previous reset tokens for the user and issues a new one.
	 * Returns the raw token, which is only ever available at generation time.
	 */
	async generateFor(user: User) {
		const rawToken = randomBytes(32).toString('hex');

		await Token.query().where('userId', user.id).where('type', TokenType.PasswordReset).delete();

		await Token.create({
			userId: user.id,
			type: TokenType.PasswordReset,
			token: hashToken(rawToken),
			expiresAt: DateTime.now().plus({ minutes: TOKEN_TTL_MINUTES }),
		});

		return rawToken;
	}

	/**
	 * Consumes a raw reset token: valid, unexpired tokens are deleted so they
	 * cannot be reused, and the owning user is returned.
	 */
	async consume(rawToken: string) {
		const resetToken = await Token.query()
			.where('token', hashToken(rawToken))
			.where('type', TokenType.PasswordReset)
			.preload('user')
			.first();

		if (!resetToken) {
			return null;
		}

		await resetToken.delete();

		if (resetToken.expiresAt < DateTime.now()) {
			return null;
		}

		return resetToken.user;
	}
}

export default new PasswordResetService();
