"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (sequelize, dataTypes) => {
    const user = sequelize.define('user', {
        username: {
            type: dataTypes.STRING,
            unique: true,
        },
        email: {
            type: dataTypes.STRING,
            unique: true,
        },
        password: dataTypes.STRING,
    });
    user.associate = (models) => {
        user.belongsToMany(models.Role, {
            through: 'rank',
            foreignKey: {
                name: 'userId',
                field: 'user_id',
            },
        });
    };
    return user;
};
//# sourceMappingURL=user.js.map