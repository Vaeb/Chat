import Sequelize from 'sequelize';

const sequelize = new Sequelize('chat', 'postgres', '1248', {
    dialect: 'postgres',
    define: {
        underscored: true,
    },
});

const models = {
    User: sequelize.import('./user'),
    Channel: sequelize.import('./channel'),
    Message: sequelize.import('./message'),
    Role: sequelize.import('./role'),
    Permission: sequelize.import('./permission'),
};

Object.keys(models).forEach((modelName) => {
    if ('associate' in models[modelName]) {
        models[modelName].associate(models);
    }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;
