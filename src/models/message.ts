
import { DataTypes, Model, Sequelize } from 'sequelize';
import { Models } from '.';

export interface Message {
  id: number;
  text: string;
}

export default (sequelize: Sequelize, dataTypes: DataTypes) => {
  const message = sequelize.define('message', {
    text: dataTypes.STRING,
  }) as Model<any, any>;

  (message as any).associate = (models: Models) => {
    message.belongsTo(models.Channel, {
      foreignKey: {
        name: 'channelId',
        field: 'channel_id',
      },
    });
    message.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        field: 'user_id',
      },
    });
  };

  return message;
};
