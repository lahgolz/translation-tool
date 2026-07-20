import { hasMany } from '@adonisjs/lucid/orm';
import type { HasMany } from '@adonisjs/lucid/types/relations';

import { ProjectSchema } from '#database/schema';

import ProjectLanguage from './project_language.ts';

export default class Project extends ProjectSchema {
	@hasMany(() => ProjectLanguage)
	declare languages: HasMany<typeof ProjectLanguage>;
}
