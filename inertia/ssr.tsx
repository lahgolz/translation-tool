import { resolvePageComponent } from '@adonisjs/inertia/helpers';
import { TuyauProvider } from '@adonisjs/inertia/react';
import { createInertiaApp } from '@inertiajs/react';
import type { ReactElement } from 'react';
import ReactDOMServer from 'react-dom/server';

import type { Data } from '#generated/data';

import { client } from '~/client';
import Layout from '~/layouts/default';

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
