export default {
    Query: {
        getPermission: (parent, { id }, { models }) => models.Permission.findOne({ where: { id } }),
    },
    Mutation: {
        createPermission: async (parent, args, { models }) => {
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
