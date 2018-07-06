module.exports = {
    up: (queryInterface, Sequelize) => [queryInterface.addColumn('users', 'vashtaId', Sequelize.INTEGER)],
    down: (queryInterface, Sequelize) => [queryInterface.removeColumn('users', 'vashtaId')],
};
