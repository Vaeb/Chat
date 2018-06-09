export default (sequelize, DataTypes) => {
    const Permission = sequelize.define('permission', {
        name: {
            type: DataTypes.STRING,
            unique: true,
        },
    });

    Permission.associate = (models) => {
        Permission.belongsToMany(models.Role, {
            through: 'perm',
            foreignKey: {
                name: 'permissionId',
                field: 'permission_id',
            },
        });
    };

    return Permission;
};
