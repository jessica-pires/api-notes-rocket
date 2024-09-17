exports.up = function(knex) {
    return knex.schema.createTable('links', table => {
        table.increments('id');
        table.text('url').notNullable().collate('utf8mb4_general_ci'); 
        table.integer('notas_id').unsigned().references('id').inTable('notas').onDelete('CASCADE'); 
        
        table.timestamp('created_at').defaultTo(knex.fn.now()); 
    });
};


exports.down = function(knex) {
    return knex.schema.dropTable('links'); // Remove a tabela 'links' se a migração for revertida
};
