import { FlagIcon } from '~/components/flag-icon';
import { Card, CardHeader, CardTitle } from '~/components/ui/card';
import { findLanguage, formatLanguageLabel } from '~/lib/languages';

export function LanguageCard({ code }: { code: string }) {
	const language = findLanguage(code);
	const label = language ? formatLanguageLabel(language) : code;

	return (
		<Card size="sm">
			<CardHeader>
				<div className="flex items-center gap-3">
					{language ? (
						<FlagIcon countryCode={language.countryCode} className="h-8 w-11 rounded-md" />
					) : (
						<div className="bg-muted h-8 w-11 rounded-md" />
					)}

					<CardTitle className="min-w-0">
						<span className="block truncate">{label}</span>
					</CardTitle>
				</div>
			</CardHeader>
		</Card>
	);
}
