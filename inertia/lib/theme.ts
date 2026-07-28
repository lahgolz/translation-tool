import { createContext, useContext } from 'react';

export type Theme = 'light' | 'dark' | 'system';

export type ThemeProviderState = {
	theme: Theme;
	setTheme: (theme: Theme) => void;
};

export const STORAGE_KEY = 'theme';
export const THEME_CHANGE_EVENT = 'themechange';

function darkMediaQuery() {
	return window.matchMedia('(prefers-color-scheme: dark)');
}

function resolveIsDark(theme: Theme) {
	return theme === 'system' ? darkMediaQuery().matches : theme === 'dark';
}

export function applyTheme(theme: Theme) {
	document.documentElement.classList.toggle('dark', resolveIsDark(theme));
}

export function getThemeSnapshot(): Theme {
	const stored = localStorage.getItem(STORAGE_KEY) ?? '';

	return ['light', 'dark'].includes(stored) ? (stored as Theme) : 'system';
}

export function subscribeToTheme(callback: () => void) {
	window.addEventListener(THEME_CHANGE_EVENT, callback);

	const media = darkMediaQuery();

	const handleSystemChange = () => {
		applyTheme(getThemeSnapshot());
		callback();
	};

	media.addEventListener('change', handleSystemChange);

	return () => {
		window.removeEventListener(THEME_CHANGE_EVENT, callback);
		media.removeEventListener('change', handleSystemChange);
	};
}

export function getThemeServerSnapshot(): Theme {
	return 'system';
}

export const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined);

export function useTheme() {
	const context = useContext(ThemeProviderContext);

	if (!context) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}

	return context;
}
