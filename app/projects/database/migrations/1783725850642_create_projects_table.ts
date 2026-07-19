import { BaseSchema } from '@adonisjs/lucid/schema';

export default class CreateProjectsTable extends BaseSchema {
	protected tableName = 'projects';

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id').notNullable();
			table.string('name').notNullable();
			table.string('slug').notNullable().unique();
			table.string('default_language').notNullable();
			table.string('picture').nullable();

			table.timestamp('created_at').notNullable();
			table.timestamp('updated_at').nullable();
		});
	}

	async down() {
		this.schema.dropTable(this.tableName);
	}
}
