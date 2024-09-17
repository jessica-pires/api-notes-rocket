exports.up = function(knex) {
    return knex.schema.createTable('notas', table => {
        table.increments('id').primary();
        table.text('title').notNullable().collate('utf8mb4_general_ci'); // Define a collation para a coluna
        table.text('description').notNullable().collate('utf8mb4_general_ci'); // Define a collation para a coluna
        table.integer('user_id').unsigned().notNullable();
        table.foreign('user_id').references('id').inTable('users');

        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('notas');
};
