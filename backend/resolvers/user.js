import { tryLogin } from '../auth';
import formatErrors from '../formatErrors';
import { requiresAuth } from '../permissions';

/*

    -chatData GraphQL query request
    -GraphQL passes args to chatData resolver method
    -Resolver returns the found User
    -GraphQL formats User to the UserView schema's structure
    -Attributes in the UserView schema that aren't in the returned User are sourced from resolver UserView object's relevantly named methods
    -Formatted UserView object is checked against the schema for errors and returned

*/

export default {
    Query: {
        chatData: requiresAuth.createResolver((parent, args, { models, user }) => models.User.findOne({ where: { id: user.id } })),
        // chatData: (parent, args, { models, user }) => models.User.findOne({ where: { id: 1 } }),
        getUser: (parent, { id }, { models }) => models.User.findOne({ where: { id } }),
        allUsers: (parent, args, { models }) => models.User.findAll(),
    },
    Mutation: {
        login: async (parent, { email, password }, { models, SECRET, SECRET2 }) => tryLogin(email, password, models, SECRET, SECRET2),
        register: async (parent, args, { models }) => {
            try {
                const user = await models.User.create(args);
                models.RoleUser.create({ roleId: 1, userId: user.id });

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
    UserView: {
        roles: ({ id: userId }, args, { models }) =>
            models.Role.findAll({
                include: [{ model: models.User, where: { '$users.id$': userId } }],
            }),
        openChannels: (parent, args, { models }) => models.Channel.findAll({ where: { locked: false } }),
        allRoles: (parent, args, { models }) => models.Role.findAll(),
        allUsers: (parent, args, { models }) => models.User.findAll(),
    },
};
