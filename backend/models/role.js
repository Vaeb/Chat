export default (sequelize, DataTypes) => {
    const Role = sequelize.define('role', {
        name: {
            type: DataTypes.STRING,
            unique: true,
            validate: {
                isAlphanumeric: {
                    args: true,
                    msg: 'The role name can only contain letters and numbers',
                },
                len: {
                    args: [1, 25],
                    msg: 'The role name needs to be between 1 and 25 characters long',
                },
            },
        },
        position: {
            type: DataTypes.INTEGER,
            unique: true,
            validate: {
                isInt: {
                    args: true,
                    msg: 'The position must be an integer',
                },
                /* min: {
                    args: 0,
                    msg: 'The position must be at least 0',
                }, */
                checkMin(value) {
                    if (parseInt(value, 10) < 0) {
                        throw new Error('The position must be at least 0');
                    }
                },
            },
        },
        color: {
            type: DataTypes.STRING,
            defaultValue: '#B9BBBE',
            validate: {
                is: {
                    args: /^#[0-9a-f]{6}$/i,
                    msg: 'The color must be a valid hex string in the format #FF019A',
                },
            },
        },
        view: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    });

    Role.associate = (models) => {
        Role.belongsToMany(models.User, {
            through: models.RoleUser,
            foreignKey: {
                name: 'roleId',
                field: 'role_id',
            },
        });
        Role.belongsToMany(models.Permission, {
            through: models.RolePermission,
            foreignKey: {
                name: 'roleId',
                field: 'role_id',
            },
        });
        Role.belongsToMany(models.Channel, {
            through: models.RoleChannel,
            foreignKey: {
                name: 'roleId',
                field: 'role_id',
            },
        });
    };

    return Role;
};
