// knexfile.js
const path = require('path');

module.exports = {
    development: {
        client: 'mysql2',
        connection: {
        host: 'localhost',
        user: 'root',
        password: 'root', 
        database: 'notes', 
        },
        migrations: {
        directory: path.resolve(__dirname, 'src', 'database', 'migrations'),
        },
        useNullAsDefault: true
    },
    };
