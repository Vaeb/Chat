"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (sequelize, dataTypes) => {
    const role = sequelize.define('role', {
        name: {
            type: dataTypes.STRING,
            unique: true,
        },
        position: {
            type: dataTypes.INTEGER,
            unique: true,
        },
        color: dataTypes.STRING,
    });
    role.associate = (models) => {
        role.belongsToMany(models.User, {
            through: 'rank',
            foreignKey: {
                name: 'roleId',
                field: 'role_id',
            },
        });
        role.belongsToMany(models.Permission, {
            through: 'perm',
            foreignKey: {
                name: 'roleId',
                field: 'role_id',
            },
        });
        role.belongsToMany(models.Channel, {
            through: 'access',
            foreignKey: {
                name: 'roleId',
                field: 'role_id',
            },
        });
    };
    return role;
};
//# sourceMappingURL=role.js.map