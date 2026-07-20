import { BaseSchema } from '@adonisjs/lucid/schema';

export default class CreateProjectLanguagesTable extends BaseSchema {
	protected tableName = 'project_languages';

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id').notNullable();
			table.integer('project_id').unsigned().notNullable().references('id').inTable('projects').onDelete('CASCADE');
			table.string('language_code').notNullable();

			table.timestamp('created_at').notNullable();
			table.timestamp('updated_at').nullable();

			table.unique(['project_id', 'language_code']);
		});
	}

	async down() {
		this.schema.dropTable(this.tableName);
	}
}
