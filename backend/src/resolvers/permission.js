import formatErrors from '../formatErrors';

export default {
    Query: {
        getPermission: (parent, { id }, { models }) => models.Permission.findOne({ where: { id }, raw: true }),
    },
    Mutation: {
        createPermission: async (parent, args, { models }) => {
            try {
                const permission = await models.Permission.create(args);

                return {
                    ok: true,
                    permission,
                };
            } catch (err) {
                console.log(err);

                return {
                    ok: false,
                    errors: formatErrors(err, models),
                };
            }
        },
    },
};
