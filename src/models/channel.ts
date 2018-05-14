
import { DataTypes, Model, Sequelize } from 'sequelize';
import { Models } from '.';

export interface Channel {
  id: number;
  name: string;
}

export default (sequelize: Sequelize, dataTypes: DataTypes) => {
  const channel = sequelize.define('channel', {
    name: {
      type: dataTypes.STRING,
      unique: true,
    },
  }) as Model<any, any>;

  (channel as any).associate = (models: Models) => {
    channel.belongsToMany(models.Role, {
      through: 'access',
      foreignKey: {
        name: 'channelId',
        field: 'channel_id',
      },
    });
  };

  return channel;
};
