export default (sequelize, DataTypes) => {
    const Channel = sequelize.define('channel', {
        name: {
            type: DataTypes.STRING,
            unique: true,
            validate: {
                is: {
                    args: /^[0-9a-z_-]+$/i,
                    msg: 'The channel name can only contain letters, numbers, underscores and hyphens',
                },
                len: {
                    args: [1, 100],
                    msg: 'The channel name needs to be between 1 and 100 characters long',
                },
            },
        },
        locked: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    });

    Channel.associate = (models) => {
        Channel.belongsToMany(models.Role, {
            through: models.RoleChannel,
            foreignKey: {
                name: 'channelId',
                field: 'channel_id',
            },
        });
    };

    return Channel;
};
