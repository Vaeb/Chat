export default {
    Mutation: {
        createMessage: async (parent, args, { models, me }) => {
            try {
                const role = await models.Message.create({
                    ...args,
                    userId: me.id,
                });
                return role.dataValues.id;
            } catch (err) {
                console.log(err);
                return -1;
            }
        },
    },
};
