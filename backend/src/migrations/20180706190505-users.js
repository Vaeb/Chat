module.exports = {
    up: (queryInterface, Sequelize) => [queryInterface.addColumn('users', 'vashtaUsername', Sequelize.STRING)],
    down: (queryInterface, Sequelize) => [queryInterface.removeColumn('users', 'vashtaUsername')],
};
