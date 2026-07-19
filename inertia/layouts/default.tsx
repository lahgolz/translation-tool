import { usePage } from '@inertiajs/react';
import { ModalRoot } from 'adonis-inertia-modal/react';
import { type ReactElement, useEffect } from 'react';
import { toast, Toaster } from 'sonner';

import type { Data } from '#generated/data';

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
			<main>{children}</main>

			<Toaster position="top-center" richColors />
			<ModalRoot />
		</>
	);
}
