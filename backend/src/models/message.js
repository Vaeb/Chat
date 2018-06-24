export default (sequelize, DataTypes) => {
    const Message = sequelize.define('message', {
        text: DataTypes.STRING(1000),
        /* validate: {
            len: {
                args: [1, 1000],
                msg: 'Messages can only be up to 1000 characters long',
            },
        }, */
    });

    Message.associate = (models) => {
        Message.belongsTo(models.Channel, {
            foreignKey: {
                name: 'channelId',
                field: 'channel_id',
            },
        });
        Message.belongsTo(models.User, {
            foreignKey: {
                name: 'userId',
                field: 'user_id',
            },
        });
    };

    return Message;
};
