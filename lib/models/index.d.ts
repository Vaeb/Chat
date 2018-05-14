/// <reference types="sequelize" />
import * as sequelize from 'sequelize';
import { Channel } from './channel';
import { Message } from './message';
import { Permission } from './permission';
import { Role } from './role';
import { User } from './user';
declare const models: {
    sequelize: sequelize.Sequelize;
    Sequelize: sequelize.Sequelize;
    User: sequelize.Model<User, any>;
    Channel: sequelize.Model<Channel, any>;
    Message: sequelize.Model<Message, any>;
    Role: sequelize.Model<Role, any>;
    Permission: sequelize.Model<Permission, any>;
};
export declare type Models = typeof models;
export { User, Channel, Message, Role, Permission };
export default models;
