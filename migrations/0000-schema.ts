import Knex from 'knex';

export async function up(knex: Knex) {
    await knex.schema.createTable('userCategories', table => {
        table.uuid('id').primary();
        table.string('name').notNullable().unique();
        table.integer('year');
    });

    await knex.schema.createTable('users', table => {
        table.uuid('id').primary();
        table.string('name').notNullable().unique();
        table.uuid('categoryId').notNullable()
            .references('id').inTable('userCategories');
    });
}

export async function down(knex: Knex) {
    // Drop the database
}