import * as Flags from 'country-flag-icons/react/3x2';

import { cn } from '~/lib/utils';

export function FlagIcon({ countryCode, className }: { countryCode: string; className?: string }) {
	const Flag = (Flags as Partial<typeof Flags>)[countryCode as keyof typeof Flags];

	if (!Flag) {
		return null;
	}

	return <Flag className={cn('h-3.5 w-5 shrink-0 rounded-xs', className)} aria-hidden="true" />;
}
