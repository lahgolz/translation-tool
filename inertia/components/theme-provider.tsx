import { type ReactNode, useCallback, useMemo, useSyncExternalStore } from 'react';

import {
	applyTheme,
	getThemeServerSnapshot,
	getThemeSnapshot,
	STORAGE_KEY,
	subscribeToTheme,
	THEME_CHANGE_EVENT,
	type Theme,
	ThemeProviderContext,
} from '~/lib/theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
	const theme = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getThemeServerSnapshot);

	const setTheme = useCallback((next: Theme) => {
		if (next === 'system') {
			localStorage.removeItem(STORAGE_KEY);
		} else {
			localStorage.setItem(STORAGE_KEY, next);
		}

		applyTheme(next);

		window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
	}, []);

	const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

	return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>;
}
