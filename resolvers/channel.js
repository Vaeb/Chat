export default {
    Mutation: {
        createChannel: async (parent, args, { models }) => {
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
