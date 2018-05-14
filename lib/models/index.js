"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize = require("sequelize");
const sequelizeInstance = new sequelize('chat', 'postgres', '1248', {
    dialect: 'postgres',
    define: {
        underscored: true,
    },
});
const models = {
    sequelize: sequelizeInstance,
    Sequelize: sequelizeInstance,
    User: sequelizeInstance.import('./user'),
    Channel: sequelizeInstance.import('./channel'),
    Message: sequelizeInstance.import('./message'),
    Role: sequelizeInstance.import('./role'),
    Permission: sequelizeInstance.import('./permission'),
};
Object.keys(models).forEach((modelName) => {
    const model = models[modelName];
    if ('associate' in model) {
        model.associate(models);
    }
});
exports.default = models;
//# sourceMappingURL=index.js.map