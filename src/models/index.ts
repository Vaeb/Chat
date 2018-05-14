
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
  User: sequelizeInstance.import<sequelize.Instance<User>, any>('./user'),
  Channel: sequelizeInstance.import<sequelize.Instance<Channel>, any>('./channel'),
  Message: sequelizeInstance.import<sequelize.Instance<Message>, any>('./message'),
  Role: sequelizeInstance.import<sequelize.Instance<Role>, any>('./role'),
  Permission: sequelizeInstance.import<sequelize.Instance<Permission>, any>('./permission'),
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
