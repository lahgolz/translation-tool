import { client } from '~/client';
import type { ReactElement } from 'react';
import Layout from '~/layouts/default';
import type { Data } from '@generated/data';
import ReactDOMServer from 'react-dom/server';
import { createInertiaApp } from '@inertiajs/react';
import { TuyauProvider } from '@adonisjs/inertia/react';
import { resolvePageComponent } from '@adonisjs/inertia/helpers';

// oxlint-disable typescript/no-explicit-any
export default async function render(page: any) {
	return createInertiaApp({
		page,
		render: ReactDOMServer.renderToString,
		resolve: async (name) =>
			resolvePageComponent(
				`./pages/${name}.tsx`,
				import.meta.glob('./pages/**/*.tsx', { eager: true }),
				(resolvedPage: ReactElement<Data.SharedProps>) => <Layout>{resolvedPage}</Layout>,
			),
		setup: ({ App, props }) => {
			return (
				<TuyauProvider client={client}>
					<App {...props} />
				</TuyauProvider>
			);
		},
	});
}
