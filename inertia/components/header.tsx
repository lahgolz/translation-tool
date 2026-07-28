import { Link, useRouter } from '@adonisjs/inertia/react';
import { LogOutIcon, MonitorIcon, MoonIcon, ShieldIcon, SunIcon } from 'lucide-react';

import type { Data } from '#generated/data';

import { Avatar, AvatarFallback } from '~/components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { useTheme } from '~/lib/theme';

function initials(name: string | null, email: string) {
	const source = name?.trim() ?? email;

	return source.slice(0, 2).toUpperCase();
}

export function Header({ user, canAccessAdminPanel }: { user: Data.Users.User; canAccessAdminPanel: boolean }) {
	const router = useRouter();
	const { theme, setTheme } = useTheme();

	const handleLogout = () => {
		router.visit({ route: 'session.destroy' }, { method: 'post' });
	};

	return (
		<header className="flex h-14 items-center justify-end border-b px-4">
			<DropdownMenu>
				<DropdownMenuTrigger className="focus-visible:ring-ring/50 rounded-full outline-none focus-visible:ring-3">
					<Avatar>
						<AvatarFallback>{initials(user.name, user.email)}</AvatarFallback>
					</Avatar>
					<span className="sr-only">Open user menu</span>
				</DropdownMenuTrigger>

				<DropdownMenuContent align="end" className="w-56">
					<DropdownMenuGroup>
						<DropdownMenuLabel>{user.name ?? user.email}</DropdownMenuLabel>

						{canAccessAdminPanel && (
							<>
								<DropdownMenuSeparator />
								<DropdownMenuItem render={<Link route="admin.roles.index" />}>
									<ShieldIcon />
									Admin panel
								</DropdownMenuItem>
							</>
						)}

						<DropdownMenuSeparator />
						<DropdownMenuLabel>Theme</DropdownMenuLabel>
						<DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
							<DropdownMenuRadioItem value="light" closeOnClick>
								<SunIcon />
								Light
							</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="dark" closeOnClick>
								<MoonIcon />
								Dark
							</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="system" closeOnClick>
								<MonitorIcon />
								System
							</DropdownMenuRadioItem>
						</DropdownMenuRadioGroup>

						<DropdownMenuSeparator />
						<DropdownMenuItem variant="destructive" onClick={handleLogout}>
							<LogOutIcon />
							Log out
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</header>
	);
}
