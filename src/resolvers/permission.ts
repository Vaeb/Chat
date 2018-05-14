
import * as Bluebird from 'bluebird';
import { SequelizeContext } from '..';
import { Permission } from '../models';

export default {
  Query: {
    getPermission: (parent: any, { id }: { [argument: string]: any }, { models }: SequelizeContext) => models.Permission.findOne({ where: { id } }),
  },
  Mutation: {
    createPermission: async (parent: any, args: { [argument: string]: any }, { models }: SequelizeContext) => {
      try {
        const permission = await models.Permission.create(args);
        return permission.dataValues.id;
      } catch (err) {
        console.log(err);
        return -1;
      }
    },
  },
};
