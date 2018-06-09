export default {
    Mutation: {
        createMessage: async (parent, args, { models, user }) => {
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
