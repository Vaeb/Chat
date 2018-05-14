
import * as Bluebird from 'bluebird';
import { SequelizeContext } from '..';
import { User } from '../models';

export default {
  Query: {
    getUser: (parent: any, { id }: { [argument: string]: any }, { models }: SequelizeContext) => models.User.findOne({ where: { id } }),
    allUsers: (parent: any, args: { [argument: string]: any }, { models }: SequelizeContext) => models.User.findAll(),
  },
  Mutation: {
    createUser: (parent: any, args: { [argument: string]: any }, { models }: SequelizeContext) => models.User.create(args),
  },
};
