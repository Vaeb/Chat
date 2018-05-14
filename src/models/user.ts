
import { DataTypes, Model, Sequelize } from 'sequelize';
import { Models } from '.';

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
}

export default (sequelize: Sequelize, dataTypes: DataTypes) => {
  const user = sequelize.define('user', {
    username: {
      type: dataTypes.STRING,
      unique: true,
    },
    email: {
      type: dataTypes.STRING,
      unique: true,
    },
    password: dataTypes.STRING,
  }) as Model<any, any>;

  (user as any).associate = (models: Models) => {
    user.belongsToMany(models.Role, {
      through: 'rank',
      foreignKey: {
        name: 'userId',
        field: 'user_id',
      },
    });
  };

  return user;
};
