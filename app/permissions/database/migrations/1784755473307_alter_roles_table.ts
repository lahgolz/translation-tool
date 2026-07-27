import config from '@adonisjs/core/services/config';
import { BaseSchema } from '@adonisjs/lucid/schema';

export default class AlterRolesTable extends BaseSchema {
	private get tableName() {
		return config.get('permissions.permissionsConfig.tables.roles') as string;
	}

	async up() {
		this.schema.alterTable(this.tableName, (table) => {
			table.text('description').nullable();
			table.boolean('is_system').notNullable().defaultTo(false);
		});
	}

	async down() {
		this.schema.alterTable(this.tableName, (table) => {
			table.dropColumn('description');
			table.dropColumn('is_system');
		});
	}
}
