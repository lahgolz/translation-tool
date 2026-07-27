import { column } from '@adonisjs/lucid/orm';
import { Role as PackageRole } from '@holoyan/adonisjs-permissions';

export default class Role extends PackageRole {
	@column()
	declare description: string | null;

	@column({ consume: (value: boolean | number) => Boolean(value) })
	declare isSystem: boolean;
}
