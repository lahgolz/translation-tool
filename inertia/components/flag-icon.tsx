import * as SquareFlags from 'country-flag-icons/react/1x1';
import * as RectangleFlags from 'country-flag-icons/react/3x2';

import { cn } from '~/lib/utils';

interface FlagIconProps {
	countryCode: string;
	className?: string;
	variant?: 'square' | 'rectangle';
}

export function FlagIcon({ countryCode, className, variant = 'square' }: FlagIconProps) {
	const Flag = variant === 'rectangle'
		? (RectangleFlags as Partial<typeof RectangleFlags>)[countryCode as keyof typeof RectangleFlags]
		: (SquareFlags as Partial<typeof SquareFlags>)[countryCode as keyof typeof SquareFlags];

	if (!Flag) {
		return null;
	}

	return <Flag className={cn(variant === 'rectangle' ? 'h-3.5 w-5 shrink-0 rounded-xs' : 'size-6 rounded-full', className)} aria-hidden="true" />;
}
