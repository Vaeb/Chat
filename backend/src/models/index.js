// import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import decamelize from 'decamelize';
import configOptions from '../config/config';

const env = process.env.NODE_ENV || 'development';
const config = configOptions[env];

console.log('Current env:', env);

const basename = path.basename(__filename);
console.log('basename', basename);

let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}

sequelize.addHook('beforeDefine', (attributes) => {
    Object.keys(attributes).forEach((key) => {
        if (typeof attributes[key] !== 'function') {
            attributes[key].field = decamelize(key);
        }
    });
});

const models = {
    User: sequelize.import('./user'),
    Channel: sequelize.import('./channel'),
    Message: sequelize.import('./message'),
    Role: sequelize.import('./role'),
    Permission: sequelize.import('./permission'),
    RoleUser: sequelize.import('./roleUser'),
    RolePermission: sequelize.import('./rolePermission'),
    RoleChannel: sequelize.import('./roleChannel'),
};

Object.keys(models).forEach((modelName) => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;
