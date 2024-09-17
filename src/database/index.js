const config = require("../../knexfile");
const knex = require("knex");

//conectando banco de dados com knex
const connection = knex(config.development);

module.exports = connection;