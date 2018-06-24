export default (sequelize, DataTypes) => {
    const RolePermission = sequelize.define('rolepermission', {});

    return RolePermission;
};
