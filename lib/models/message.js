"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (sequelize, dataTypes) => {
    const message = sequelize.define('message', {
        text: dataTypes.STRING,
    });
    message.associate = (models) => {
        message.belongsTo(models.Channel, {
            foreignKey: {
                name: 'channelId',
                field: 'channel_id',
            },
        });
        message.belongsTo(models.User, {
            foreignKey: {
                name: 'userId',
                field: 'user_id',
            },
        });
    };
    return message;
};
//# sourceMappingURL=message.js.map