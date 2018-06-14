import { tryLogin } from '../auth';
import formatErrors from '../formatErrors';

export default {
    Query: {
        getUser: (parent, { id }, { models }) => models.User.findOne({ where: { id } }),
        allUsers: (parent, args, { models }) => models.User.findAll(),
    },
    Mutation: {
        login: async (parent, { email, password }, { models, SECRET, SECRET2 }) => tryLogin(email, password, models, SECRET, SECRET2),
        register: async (parent, args, { models }) => {
            try {
                const user = await models.User.create(args);

                return {
                    ok: true,
                    user,
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
    User: {
        roles: ({ id: userId }, args, { models }) =>
            models.Role.findAll({
                include: [{ model: models.User, where: { '$users.id$': userId } }],
            }),
    },
};
