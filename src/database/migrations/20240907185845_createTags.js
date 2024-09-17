exports.up = function(knex) {
    return knex.schema.createTable('tags', table => {
        table.increments('id');
        table.text('name').notNullable().collate('utf8mb4_general_ci');
        
        
        table.integer('user_id').unsigned().references('id').inTable('users'); 

        
        table.integer('notas_id').unsigned().references('id').inTable('notas').onDelete('CASCADE'); 
        
        table.timestamps(true, true); 
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('tags'); 
};
