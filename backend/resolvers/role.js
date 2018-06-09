export default {
    Mutation: {
        createRole: async (parent, args, { models }) => {
            try {
                const role = await models.Role.create(args);
                return role.dataValues.id;
            } catch (err) {
                console.log(err);
                return -1;
            }
        },
    },
};
