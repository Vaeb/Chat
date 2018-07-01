export default (sequelize, DataTypes) => {
    const RoleChannel = sequelize.define('rolechannel', {
        send: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    });

    return RoleChannel;
};
