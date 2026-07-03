import { resolvePageComponent } from '@adonisjs/inertia/helpers';
import { TuyauProvider } from '@adonisjs/inertia/react';
import type { Data } from '@generated/data';
import { createInertiaApp } from '@inertiajs/react';
import type { ReactElement } from 'react';
import { createRoot } from 'react-dom/client';

import Layout from '~/layouts/default';

import { client } from './client';

import './css/app.css';

const appName: string = import.meta.env.VITE_APP_NAME ?? 'AdonisJS';

void createInertiaApp({
	title: (title) => (title ? `${title} - ${appName}` : appName),
	resolve: async (name) =>
		resolvePageComponent(
			`./pages/${name}.tsx`,
			import.meta.glob('./pages/**/*.tsx'),
			(page: ReactElement<Data.SharedProps>) => <Layout>{page}</Layout>,
		),
	setup({ el: element, App, props }) {
		createRoot(element).render(
			<TuyauProvider client={client}>
				<App {...props} />
			</TuyauProvider>,
		);
	},
	progress: {
		color: '#4B5563',
	},
});
