export default (sequelize, DataTypes) => {
    const Role = sequelize.define('role', {
        name: {
            type: DataTypes.STRING,
            unique: true,
        },
        position: {
            type: DataTypes.INTEGER,
            unique: true,
        },
        color: DataTypes.STRING,
    });

    Role.associate = (models) => {
        Role.belongsToMany(models.User, {
            through: 'rank',
            foreignKey: {
                name: 'roleId',
                field: 'role_id',
            },
        });
        Role.belongsToMany(models.Permission, {
            through: 'perm',
            foreignKey: {
                name: 'roleId',
                field: 'role_id',
            },
        });
        Role.belongsToMany(models.Channel, {
            through: 'access',
            foreignKey: {
                name: 'roleId',
                field: 'role_id',
            },
        });
    };

    return Role;
};
