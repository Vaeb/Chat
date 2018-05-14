
import { DataTypes, Model, Sequelize } from 'sequelize';
import { Models } from '.';

export interface Permission {
  id: number;
  name: string;
}

export default (sequelize: Sequelize, dataTypes: DataTypes) => {
  const permission = sequelize.define('permission', {
    name: {
      type: dataTypes.STRING,
      unique: true,
    },
  }) as Model<any, any>;

  (permission as any).associate = (models: Models) => {
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
