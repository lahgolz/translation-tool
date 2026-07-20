import { belongsTo } from '@adonisjs/lucid/orm';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';

import { ProjectLanguageSchema } from '#database/schema';

import Project from './project.ts';

export default class ProjectLanguage extends ProjectLanguageSchema {
	@belongsTo(() => Project)
	declare project: BelongsTo<typeof Project>;
}
