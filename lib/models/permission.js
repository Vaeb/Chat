"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (sequelize, dataTypes) => {
    const permission = sequelize.define('permission', {
        name: {
            type: dataTypes.STRING,
            unique: true,
        },
    });
    permission.associate = (models) => {
        permission.belongsToMany(models.Role, {
            through: 'perm',
            foreignKey: {
                name: 'permissionId',
                field: 'permission_id',
            },
        });
    };
    return permission;
};
//# sourceMappingURL=permission.js.map