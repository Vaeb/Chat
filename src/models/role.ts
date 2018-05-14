
import { DataTypes, Model, Sequelize } from 'sequelize';
import { Models } from '.';

export interface Role {
  id: number;
  name: string;
  position: number;
  color: string;
}

export default (sequelize: Sequelize, dataTypes: DataTypes) => {
  const role = sequelize.define('role', {
    name: {
      type: dataTypes.STRING,
      unique: true,
    },
    position: {
      type: dataTypes.INTEGER,
      unique: true,
    },
    color: dataTypes.STRING,
  }) as Model<any, any>;

  (role as any).associate = (models: Models) => {
    role.belongsToMany(models.User, {
      through: 'rank',
      foreignKey: {
        name: 'roleId',
        field: 'role_id',
      },
    });
    role.belongsToMany(models.Permission, {
      through: 'perm',
      foreignKey: {
        name: 'roleId',
        field: 'role_id',
      },
    });
    role.belongsToMany(models.Channel, {
      through: 'access',
      foreignKey: {
        name: 'roleId',
        field: 'role_id',
      },
    });
  };

  return role;
};
