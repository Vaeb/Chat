"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (sequelize, dataTypes) => {
    const channel = sequelize.define('channel', {
        name: {
            type: dataTypes.STRING,
            unique: true,
        },
    });
    channel.associate = (models) => {
        channel.belongsToMany(models.Role, {
            through: 'access',
            foreignKey: {
                name: 'channelId',
                field: 'channel_id',
            },
        });
    };
    return channel;
};
//# sourceMappingURL=channel.js.map