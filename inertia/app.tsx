import './css/app.css';
import type { ReactElement } from 'react';
import { client } from './client';
import Layout from '~/layouts/default';
import type { Data } from '@generated/data';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { TuyauProvider } from '@adonisjs/inertia/react';
import { resolvePageComponent } from '@adonisjs/inertia/helpers';

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
