export default (sequelize, DataTypes) => {
    const Channel = sequelize.define('channel', {
        name: {
            type: DataTypes.STRING,
            unique: true,
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
