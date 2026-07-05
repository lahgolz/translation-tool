import { Form } from '@adonisjs/inertia/react';

import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '~/components/ui/field';
import { Input } from '~/components/ui/input';

export default function Login() {
	return (
		<div className="flex min-h-svh items-center justify-center p-6">
			<div className="w-full max-w-sm">
				<Card>
					<CardHeader>
						<CardTitle>Login</CardTitle>
						<CardDescription>Enter your details below to login to your account</CardDescription>
					</CardHeader>

					<CardContent>
						<Form route="session.store">
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

									<Field data-invalid={errors.password ? true : undefined}>
										<FieldLabel htmlFor="password">Password</FieldLabel>
										<Input
											id="password"
											name="password"
											type="password"
											autoComplete="current-password"
											aria-invalid={errors.password ? true : undefined}
										/>
										{errors.password && <FieldError>{errors.password}</FieldError>}
									</Field>

									<Button type="submit" disabled={processing}>
										Login
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
