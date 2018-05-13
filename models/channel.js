export default (sequelize, DataTypes) => {
    const Channel = sequelize.define('channel', {
        name: {
            type: DataTypes.STRING,
            unique: true,
        },
    });

    Channel.associate = (models) => {
        Channel.belongsToMany(models.Role, {
            through: 'access',
            foreignKey: {
                name: 'channelId',
                field: 'channel_id',
            },
        });
    };

    return Channel;
};
