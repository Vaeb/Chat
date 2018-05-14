
import { SequelizeContext } from '..';

export default {
  Mutation: {
    createRole: async (parent: any, args: { [argument: string]: any }, { models }: SequelizeContext) => {
      try {
        const role = await models.Role.create(args);
        return role.get('id');
      } catch (err) {
        console.log(err);
        return -1;
      }
    },
  },
};
