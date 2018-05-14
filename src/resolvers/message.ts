
import { SequelizeContext } from '..';

export default {
  Mutation: {
    createMessage: async (parent: any, args: { [argument: string]: any }, { models, user }: SequelizeContext) => {
      try {
        const role = await models.Message.create({
          ...args,
          userId: user.id,
        });
        return role.dataValues.id;
      } catch (err) {
        console.log(err);
        return -1;
      }
    },
  },
};
