import { BaseMail } from '@adonisjs/mail';

import type User from '#users/models/user';

export default class ResetPasswordNotification extends BaseMail {
	subject = 'Reset your password';

	constructor(
		private user: User,
		readonly resetUrl: string,
	) {
		super();
	}

	prepare() {
		this.message.to(this.user.email);
		this.message.htmlView('emails/reset_password', { resetUrl: this.resetUrl });
		this.message.textView('emails/reset_password_text', { resetUrl: this.resetUrl });
	}
}
