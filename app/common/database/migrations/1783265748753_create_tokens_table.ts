import { BaseSchema } from '@adonisjs/lucid/schema';

export default class CreateTokensTable extends BaseSchema {
	protected tableName = 'tokens';

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id').notNullable();
			table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
			table.string('type').notNullable();
			table.string('token', 64).notNullable().unique();

			table.timestamp('expires_at').notNullable();
			table.timestamp('created_at').notNullable();
		});
	}

	async down() {
		this.schema.dropTable(this.tableName);
	}
}
