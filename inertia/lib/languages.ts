export interface LanguageOption {
	code: string;
	name: string;
	nativeName: string;
	countryCode: string;
	countryName: string;
	nativeCountryName: string;
}

export interface LanguageGroup {
	name: string;
	items: LanguageOption[];
}

export const LANGUAGES: LanguageOption[] = [
	{
		code: 'en',
		name: 'English',
		nativeName: 'English',
		countryCode: 'GB',
		countryName: 'United Kingdom',
		nativeCountryName: 'United Kingdom',
	},
	{
		code: 'en-US',
		name: 'English',
		nativeName: 'English',
		countryCode: 'US',
		countryName: 'United States',
		nativeCountryName: 'United States',
	},
	{
		code: 'en-GB',
		name: 'English',
		nativeName: 'English',
		countryCode: 'GB',
		countryName: 'United Kingdom',
		nativeCountryName: 'United Kingdom',
	},
	{
		code: 'en-AU',
		name: 'English',
		nativeName: 'English',
		countryCode: 'AU',
		countryName: 'Australia',
		nativeCountryName: 'Australia',
	},
	{
		code: 'en-CA',
		name: 'English',
		nativeName: 'English',
		countryCode: 'CA',
		countryName: 'Canada',
		nativeCountryName: 'Canada',
	},
	{
		code: 'en-IE',
		name: 'English',
		nativeName: 'English',
		countryCode: 'IE',
		countryName: 'Ireland',
		nativeCountryName: 'Ireland',
	},
	{
		code: 'en-NZ',
		name: 'English',
		nativeName: 'English',
		countryCode: 'NZ',
		countryName: 'New Zealand',
		nativeCountryName: 'New Zealand',
	},
	{
		code: 'en-ZA',
		name: 'English',
		nativeName: 'English',
		countryCode: 'ZA',
		countryName: 'South Africa',
		nativeCountryName: 'South Africa',
	},
	{
		code: 'en-IN',
		name: 'English',
		nativeName: 'English',
		countryCode: 'IN',
		countryName: 'India',
		nativeCountryName: 'India',
	},

	{
		code: 'es',
		name: 'Spanish',
		nativeName: 'Español',
		countryCode: 'ES',
		countryName: 'Spain',
		nativeCountryName: 'España',
	},
	{
		code: 'es-ES',
		name: 'Spanish',
		nativeName: 'Español',
		countryCode: 'ES',
		countryName: 'Spain',
		nativeCountryName: 'España',
	},
	{
		code: 'es-MX',
		name: 'Spanish',
		nativeName: 'Español',
		countryCode: 'MX',
		countryName: 'Mexico',
		nativeCountryName: 'México',
	},
	{
		code: 'es-AR',
		name: 'Spanish',
		nativeName: 'Español',
		countryCode: 'AR',
		countryName: 'Argentina',
		nativeCountryName: 'Argentina',
	},
	{
		code: 'es-CO',
		name: 'Spanish',
		nativeName: 'Español',
		countryCode: 'CO',
		countryName: 'Colombia',
		nativeCountryName: 'Colombia',
	},
	{
		code: 'es-CL',
		name: 'Spanish',
		nativeName: 'Español',
		countryCode: 'CL',
		countryName: 'Chile',
		nativeCountryName: 'Chile',
	},
	{
		code: 'es-PE',
		name: 'Spanish',
		nativeName: 'Español',
		countryCode: 'PE',
		countryName: 'Peru',
		nativeCountryName: 'Perú',
	},
	{
		code: 'es-US',
		name: 'Spanish',
		nativeName: 'Español',
		countryCode: 'US',
		countryName: 'United States',
		nativeCountryName: 'Estados Unidos',
	},

	{
		code: 'fr',
		name: 'French',
		nativeName: 'Français',
		countryCode: 'FR',
		countryName: 'France',
		nativeCountryName: 'France',
	},
	{
		code: 'fr-FR',
		name: 'French',
		nativeName: 'Français',
		countryCode: 'FR',
		countryName: 'France',
		nativeCountryName: 'France',
	},
	{
		code: 'fr-CA',
		name: 'French',
		nativeName: 'Français',
		countryCode: 'CA',
		countryName: 'Canada',
		nativeCountryName: 'Canada',
	},
	{
		code: 'fr-BE',
		name: 'French',
		nativeName: 'Français',
		countryCode: 'BE',
		countryName: 'Belgium',
		nativeCountryName: 'Belgique',
	},
	{
		code: 'fr-CH',
		name: 'French',
		nativeName: 'Français',
		countryCode: 'CH',
		countryName: 'Switzerland',
		nativeCountryName: 'Suisse',
	},

	{
		code: 'pt',
		name: 'Portuguese',
		nativeName: 'Português',
		countryCode: 'PT',
		countryName: 'Portugal',
		nativeCountryName: 'Portugal',
	},
	{
		code: 'pt-PT',
		name: 'Portuguese',
		nativeName: 'Português',
		countryCode: 'PT',
		countryName: 'Portugal',
		nativeCountryName: 'Portugal',
	},
	{
		code: 'pt-BR',
		name: 'Portuguese',
		nativeName: 'Português',
		countryCode: 'BR',
		countryName: 'Brazil',
		nativeCountryName: 'Brasil',
	},

	{
		code: 'de',
		name: 'German',
		nativeName: 'Deutsch',
		countryCode: 'DE',
		countryName: 'Germany',
		nativeCountryName: 'Deutschland',
	},
	{
		code: 'de-DE',
		name: 'German',
		nativeName: 'Deutsch',
		countryCode: 'DE',
		countryName: 'Germany',
		nativeCountryName: 'Deutschland',
	},
	{
		code: 'de-AT',
		name: 'German',
		nativeName: 'Deutsch',
		countryCode: 'AT',
		countryName: 'Austria',
		nativeCountryName: 'Österreich',
	},
	{
		code: 'de-CH',
		name: 'German',
		nativeName: 'Deutsch',
		countryCode: 'CH',
		countryName: 'Switzerland',
		nativeCountryName: 'Schweiz',
	},

	{
		code: 'zh',
		name: 'Chinese',
		nativeName: '中文',
		countryCode: 'CN',
		countryName: 'China',
		nativeCountryName: '中国',
	},
	{
		code: 'zh-CN',
		name: 'Chinese',
		nativeName: '中文',
		countryCode: 'CN',
		countryName: 'China',
		nativeCountryName: '中国',
	},
	{
		code: 'zh-TW',
		name: 'Chinese',
		nativeName: '中文',
		countryCode: 'TW',
		countryName: 'Taiwan',
		nativeCountryName: '台灣',
	},
	{
		code: 'zh-HK',
		name: 'Chinese',
		nativeName: '中文',
		countryCode: 'HK',
		countryName: 'Hong Kong',
		nativeCountryName: '香港',
	},

	{
		code: 'ar',
		name: 'Arabic',
		nativeName: 'العربية',
		countryCode: 'EG',
		countryName: 'Egypt',
		nativeCountryName: 'مصر',
	},
	{
		code: 'ar-SA',
		name: 'Arabic',
		nativeName: 'العربية',
		countryCode: 'SA',
		countryName: 'Saudi Arabia',
		nativeCountryName: 'السعودية',
	},
	{
		code: 'ar-EG',
		name: 'Arabic',
		nativeName: 'العربية',
		countryCode: 'EG',
		countryName: 'Egypt',
		nativeCountryName: 'مصر',
	},
	{
		code: 'ar-AE',
		name: 'Arabic',
		nativeName: 'العربية',
		countryCode: 'AE',
		countryName: 'United Arab Emirates',
		nativeCountryName: 'الإمارات',
	},

	{
		code: 'nl',
		name: 'Dutch',
		nativeName: 'Nederlands',
		countryCode: 'NL',
		countryName: 'Netherlands',
		nativeCountryName: 'Nederland',
	},
	{
		code: 'nl-NL',
		name: 'Dutch',
		nativeName: 'Nederlands',
		countryCode: 'NL',
		countryName: 'Netherlands',
		nativeCountryName: 'Nederland',
	},
	{
		code: 'nl-BE',
		name: 'Dutch',
		nativeName: 'Nederlands',
		countryCode: 'BE',
		countryName: 'Belgium',
		nativeCountryName: 'België',
	},

	{
		code: 'it',
		name: 'Italian',
		nativeName: 'Italiano',
		countryCode: 'IT',
		countryName: 'Italy',
		nativeCountryName: 'Italia',
	},
	{
		code: 'ru',
		name: 'Russian',
		nativeName: 'Русский',
		countryCode: 'RU',
		countryName: 'Russia',
		nativeCountryName: 'Россия',
	},
	{
		code: 'ja',
		name: 'Japanese',
		nativeName: '日本語',
		countryCode: 'JP',
		countryName: 'Japan',
		nativeCountryName: '日本',
	},
	{
		code: 'ko',
		name: 'Korean',
		nativeName: '한국어',
		countryCode: 'KR',
		countryName: 'South Korea',
		nativeCountryName: '대한민국',
	},
	{
		code: 'pl',
		name: 'Polish',
		nativeName: 'Polski',
		countryCode: 'PL',
		countryName: 'Poland',
		nativeCountryName: 'Polska',
	},
	{
		code: 'tr',
		name: 'Turkish',
		nativeName: 'Türkçe',
		countryCode: 'TR',
		countryName: 'Turkey',
		nativeCountryName: 'Türkiye',
	},
	{
		code: 'sv',
		name: 'Swedish',
		nativeName: 'Svenska',
		countryCode: 'SE',
		countryName: 'Sweden',
		nativeCountryName: 'Sverige',
	},
	{
		code: 'no',
		name: 'Norwegian',
		nativeName: 'Norsk',
		countryCode: 'NO',
		countryName: 'Norway',
		nativeCountryName: 'Norge',
	},
	{
		code: 'da',
		name: 'Danish',
		nativeName: 'Dansk',
		countryCode: 'DK',
		countryName: 'Denmark',
		nativeCountryName: 'Danmark',
	},
	{
		code: 'fi',
		name: 'Finnish',
		nativeName: 'Suomi',
		countryCode: 'FI',
		countryName: 'Finland',
		nativeCountryName: 'Suomi',
	},
	{
		code: 'el',
		name: 'Greek',
		nativeName: 'Ελληνικά',
		countryCode: 'GR',
		countryName: 'Greece',
		nativeCountryName: 'Ελλάδα',
	},
	{
		code: 'he',
		name: 'Hebrew',
		nativeName: 'עברית',
		countryCode: 'IL',
		countryName: 'Israel',
		nativeCountryName: 'ישראל',
	},
	{
		code: 'hi',
		name: 'Hindi',
		nativeName: 'हिन्दी',
		countryCode: 'IN',
		countryName: 'India',
		nativeCountryName: 'भारत',
	},
	{
		code: 'id',
		name: 'Indonesian',
		nativeName: 'Bahasa Indonesia',
		countryCode: 'ID',
		countryName: 'Indonesia',
		nativeCountryName: 'Indonesia',
	},
	{
		code: 'th',
		name: 'Thai',
		nativeName: 'ไทย',
		countryCode: 'TH',
		countryName: 'Thailand',
		nativeCountryName: 'ประเทศไทย',
	},
	{
		code: 'vi',
		name: 'Vietnamese',
		nativeName: 'Tiếng Việt',
		countryCode: 'VN',
		countryName: 'Vietnam',
		nativeCountryName: 'Việt Nam',
	},
	{
		code: 'uk',
		name: 'Ukrainian',
		nativeName: 'Українська',
		countryCode: 'UA',
		countryName: 'Ukraine',
		nativeCountryName: 'Україна',
	},
	{
		code: 'ro',
		name: 'Romanian',
		nativeName: 'Română',
		countryCode: 'RO',
		countryName: 'Romania',
		nativeCountryName: 'România',
	},
	{
		code: 'hu',
		name: 'Hungarian',
		nativeName: 'Magyar',
		countryCode: 'HU',
		countryName: 'Hungary',
		nativeCountryName: 'Magyarország',
	},
	{
		code: 'cs',
		name: 'Czech',
		nativeName: 'Čeština',
		countryCode: 'CZ',
		countryName: 'Czechia',
		nativeCountryName: 'Česko',
	},
	{
		code: 'sk',
		name: 'Slovak',
		nativeName: 'Slovenčina',
		countryCode: 'SK',
		countryName: 'Slovakia',
		nativeCountryName: 'Slovensko',
	},
	{
		code: 'bg',
		name: 'Bulgarian',
		nativeName: 'Български',
		countryCode: 'BG',
		countryName: 'Bulgaria',
		nativeCountryName: 'България',
	},
	{
		code: 'hr',
		name: 'Croatian',
		nativeName: 'Hrvatski',
		countryCode: 'HR',
		countryName: 'Croatia',
		nativeCountryName: 'Hrvatska',
	},
	{
		code: 'sr',
		name: 'Serbian',
		nativeName: 'Српски',
		countryCode: 'RS',
		countryName: 'Serbia',
		nativeCountryName: 'Србија',
	},
	{
		code: 'sl',
		name: 'Slovenian',
		nativeName: 'Slovenščina',
		countryCode: 'SI',
		countryName: 'Slovenia',
		nativeCountryName: 'Slovenija',
	},
	{
		code: 'et',
		name: 'Estonian',
		nativeName: 'Eesti',
		countryCode: 'EE',
		countryName: 'Estonia',
		nativeCountryName: 'Eesti',
	},
	{
		code: 'lv',
		name: 'Latvian',
		nativeName: 'Latviešu',
		countryCode: 'LV',
		countryName: 'Latvia',
		nativeCountryName: 'Latvija',
	},
	{
		code: 'lt',
		name: 'Lithuanian',
		nativeName: 'Lietuvių',
		countryCode: 'LT',
		countryName: 'Lithuania',
		nativeCountryName: 'Lietuva',
	},
	{
		code: 'ms',
		name: 'Malay',
		nativeName: 'Bahasa Melayu',
		countryCode: 'MY',
		countryName: 'Malaysia',
		nativeCountryName: 'Malaysia',
	},
	{
		code: 'tl',
		name: 'Filipino',
		nativeName: 'Filipino',
		countryCode: 'PH',
		countryName: 'Philippines',
		nativeCountryName: 'Pilipinas',
	},
	{
		code: 'bn',
		name: 'Bengali',
		nativeName: 'বাংলা',
		countryCode: 'BD',
		countryName: 'Bangladesh',
		nativeCountryName: 'বাংলাদেশ',
	},
	{
		code: 'ur',
		name: 'Urdu',
		nativeName: 'اردو',
		countryCode: 'PK',
		countryName: 'Pakistan',
		nativeCountryName: 'پاکستان',
	},
	{
		code: 'fa',
		name: 'Persian',
		nativeName: 'فارسی',
		countryCode: 'IR',
		countryName: 'Iran',
		nativeCountryName: 'ایران',
	},
	{
		code: 'sw',
		name: 'Swahili',
		nativeName: 'Kiswahili',
		countryCode: 'KE',
		countryName: 'Kenya',
		nativeCountryName: 'Kenya',
	},
	{
		code: 'ka',
		name: 'Georgian',
		nativeName: 'ქართული',
		countryCode: 'GE',
		countryName: 'Georgia',
		nativeCountryName: 'საქართველო',
	},
	{
		code: 'is',
		name: 'Icelandic',
		nativeName: 'Íslenska',
		countryCode: 'IS',
		countryName: 'Iceland',
		nativeCountryName: 'Ísland',
	},
	{
		code: 'mt',
		name: 'Maltese',
		nativeName: 'Malti',
		countryCode: 'MT',
		countryName: 'Malta',
		nativeCountryName: 'Malta',
	},
	{
		code: 'lb',
		name: 'Luxembourgish',
		nativeName: 'Lëtzebuergesch',
		countryCode: 'LU',
		countryName: 'Luxembourg',
		nativeCountryName: 'Lëtzebuerg',
	},
	{
		code: 'ga',
		name: 'Irish',
		nativeName: 'Gaeilge',
		countryCode: 'IE',
		countryName: 'Ireland',
		nativeCountryName: 'Éire',
	},
];

export function groupLanguages(languages: LanguageOption[]): LanguageGroup[] {
	const groups = new Map<string, LanguageOption[]>();

	for (const language of languages) {
		const existing = groups.get(language.name);

		if (existing) {
			existing.push(language);
		} else {
			groups.set(language.name, [language]);
		}
	}

	return [...groups.entries()]
		.map(([name, items]) => ({ name, items }))
		.toSorted((a, b) => a.name.localeCompare(b.name));
}

export const LANGUAGE_GROUPS: LanguageGroup[] = groupLanguages(LANGUAGES);

export function isBcp47(code: string): boolean {
	return code.includes('-');
}

export function formatLanguageLabel(language: LanguageOption): string {
	if (!isBcp47(language.code)) {
		return `${language.name} | ${language.nativeName} (${language.code})`;
	}

	return `${language.name} (${language.countryName}) | ${language.nativeName} (${language.nativeCountryName}) (${language.code})`;
}

export function findLanguage(code: string): LanguageOption | undefined {
	return LANGUAGES.find((language) => language.code === code);
}

export function sortProjectLanguages(codes: string[], defaultLanguage: string): string[] {
	return codes.toSorted((a, b) => {
		if (a === defaultLanguage) {
			return -1;
		}

		if (b === defaultLanguage) {
			return 1;
		}

		const nameA = findLanguage(a)?.name ?? a;
		const nameB = findLanguage(b)?.name ?? b;

		return nameA.localeCompare(nameB);
	});
}

export function matchesLanguageQuery(language: LanguageOption, query: string): boolean {
	const normalized = query.trim().toLowerCase();

	if (!normalized) {
		return true;
	}

	return (
		language.code.toLowerCase().includes(normalized) ||
		language.name.toLowerCase().includes(normalized) ||
		language.nativeName.toLowerCase().includes(normalized) ||
		language.countryName.toLowerCase().includes(normalized) ||
		language.nativeCountryName.toLowerCase().includes(normalized)
	);
}
