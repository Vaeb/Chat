
import { SequelizeContext } from '..';

export default {
  Mutation: {
    createChannel: async (parent: any, args: { [argument: string]: any }, { models }: SequelizeContext) => {
      try {
        const channel = await models.Channel.create(args);
        return channel.dataValues.id;
      } catch (err) {
        console.log(err);
        return -1;
      }
    },
  },
};
