import { Form, Link } from '@adonisjs/inertia/react';

import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '~/components/ui/field';
import { Input } from '~/components/ui/input';

export default function ForgotPassword() {
	return (
		<div className="flex min-h-svh items-center justify-center p-6">
			<div className="w-full max-w-sm">
				<Card>
					<CardHeader>
						<CardTitle>Forgot password</CardTitle>
						<CardDescription>Enter your email and we&apos;ll send you a link to reset your password</CardDescription>
					</CardHeader>

					<CardContent>
						<Form route="password_resets.store">
							{({ errors, processing }) => (
								<FieldGroup>
									<Field data-invalid={errors.email ? true : undefined}>
										<FieldLabel htmlFor="email">Email</FieldLabel>
										<Input
											id="email"
											name="email"
											type="email"
											autoComplete="username"
											aria-invalid={errors.email ? true : undefined}
										/>
										{errors.email && <FieldError>{errors.email}</FieldError>}
									</Field>

									<Button type="submit" disabled={processing}>
										Send reset link
									</Button>

									<p className="text-center text-sm underline underline-offset-4">
										<Link route="session.create">Back to login</Link>
									</p>
								</FieldGroup>
							)}
						</Form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
