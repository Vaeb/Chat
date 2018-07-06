module.exports = {
    up: (queryInterface, Sequelize) => [
        queryInterface.removeColumn('users', 'vashtaId'),
        queryInterface.removeColumn('users', 'vashtaUsername'),
        queryInterface.addColumn('users', 'vashta_id', Sequelize.INTEGER),
        queryInterface.addColumn('users', 'vashta_username', Sequelize.STRING),
    ],
    down: (queryInterface, Sequelize) => [
        queryInterface.removeColumn('users', 'vashta_id'),
        queryInterface.removeColumn('users', 'vashta_username'),
    ],
};
