import { usePage } from '@inertiajs/react';
import { ModalRoot } from 'adonis-inertia-modal/react';
import { type ReactElement, useEffect } from 'react';
import { toast, Toaster } from 'sonner';

import type { Data } from '#generated/data';

import { Header } from '~/components/header';

export default function Layout({ children }: { children: ReactElement<Data.SharedProps> }) {
	const { url } = usePage();

	useEffect(() => {
		toast.dismiss();
	}, [url]);

	useEffect(() => {
		if (children.props.flash.error) {
			toast.error(children.props.flash.error);
		}

		if (children.props.flash.success) {
			toast.success(children.props.flash.success);
		}
	}, [children.props.flash]);

	return (
		<>
			<a
				href="#content"
				className="focus:bg-primary focus:text-primary-foreground sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:px-4 focus:py-2"
			>
				Skip to content
			</a>

			{children.props.user && (
				<Header user={children.props.user} canAccessAdminPanel={children.props.canAccessAdminPanel} />
			)}

			<main id="content">{children}</main>

			<Toaster position="top-center" richColors />
			<ModalRoot />
		</>
	);
}
