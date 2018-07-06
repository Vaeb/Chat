const Sequelize = require('sequelize');

module.exports = {
    development: {
        username: 'postgres',
        password: '1248',
        database: 'chat',
        host: '127.0.0.1',
        dialect: 'postgres',
        operatorsAliases: Sequelize.Op,
        define: {
            underscored: true,
        },
        logging: false,
    },
    test: {
        username: 'postgres',
        password: '1248',
        database: 'chat',
        host: '127.0.0.1',
        dialect: 'postgres',
        operatorsAliases: Sequelize.Op,
        define: {
            underscored: true,
        },
        logging: false,
    },
    production: {
        username: 'postgres',
        password: '1248',
        database: 'chat',
        host: '127.0.0.1',
        dialect: 'postgres',
        operatorsAliases: Sequelize.Op,
        define: {
            underscored: true,
        },
        logging: false,
    },
};
