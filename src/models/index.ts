
import * as sequelize from 'sequelize';
import { Channel } from './channel';
import { Message } from './message';
import { Permission } from './permission';
import { Role } from './role';
import { User } from './user';

const sequelizeInstance = new sequelize('chat', 'postgres', '1248', {
  dialect: 'postgres',
  define: {
    underscored: true,
  },
});

const models = {
  sequelize: sequelizeInstance,
  Sequelize: sequelizeInstance,
  User: sequelizeInstance.import<User, any>('./user'),
  Channel: sequelizeInstance.import<Channel, any>('./channel'),
  Message: sequelizeInstance.import<Message, any>('./message'),
  Role: sequelizeInstance.import<Role, any>('./role'),
  Permission: sequelizeInstance.import<Permission, any>('./permission'),
};

Object.keys(models).forEach((modelName) => {
  const model = (models as any)[modelName];
  if ('associate' in model) {
    model.associate(models);
  }
});

export type Models = typeof models;
export { User, Channel, Message, Role, Permission };

export default models;
