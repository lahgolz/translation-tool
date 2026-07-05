import { Form } from '@adonisjs/inertia/react';

import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '~/components/ui/field';
import { Input } from '~/components/ui/input';
import type { InertiaProps } from '~/types';

type Props = InertiaProps<{ token: string }>;

export default function ResetPassword({ token }: Props) {
	return (
		<div className="flex min-h-svh items-center justify-center p-6">
			<div className="w-full max-w-sm">
				<Card>
					<CardHeader>
						<CardTitle>Reset password</CardTitle>
						<CardDescription>Enter your new password below</CardDescription>
					</CardHeader>

					<CardContent>
						<Form route="password_resets.update">
							{({ errors, processing }) => (
								<FieldGroup>
									<input type="hidden" name="token" value={token} />

									<Field data-invalid={errors.password ? true : undefined}>
										<FieldLabel htmlFor="password">New password</FieldLabel>
										<Input
											id="password"
											name="password"
											type="password"
											autoComplete="new-password"
											aria-invalid={errors.password ? true : undefined}
										/>
										{errors.password && <FieldError>{errors.password}</FieldError>}
									</Field>

									<Field data-invalid={errors.password_confirmation ? true : undefined}>
										<FieldLabel htmlFor="password_confirmation">Confirm password</FieldLabel>
										<Input
											id="password_confirmation"
											name="password_confirmation"
											type="password"
											autoComplete="new-password"
											aria-invalid={errors.password_confirmation ? true : undefined}
										/>
										{errors.password_confirmation && <FieldError>{errors.password_confirmation}</FieldError>}
									</Field>

									<Button type="submit" disabled={processing}>
										Reset password
									</Button>
								</FieldGroup>
							)}
						</Form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
