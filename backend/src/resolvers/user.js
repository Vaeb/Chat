import { tryLogin } from '../auth';
import formatErrors from '../formatErrors';
import { requiresAuth } from '../permissions';
import { linkedQuery, linkedQueryId } from '../linkedQueries';

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
        chatData: requiresAuth.createResolver((parent, args, { models, me }) => models.User.findOne({ where: { id: me.id } })),
        // chatData: (parent, args, { models, me }) => models.User.findOne({ where: { id: 1 } }),
        getUser: (parent, { id }, { models }) => models.User.findOne({ where: { id }, raw: true }),
        allUsers: (parent, args, { models }) => models.User.findAll({ raw: true }),
    },
    Mutation: {
        login: async (parent, { email, password }, { models, SECRET, SECRET2 }) => tryLogin(email, password, models, SECRET, SECRET2),
        register: async (parent, args, { models }) => {
            try {
                const response = await models.sequelize.transaction(async (transaction) => {
                    const user = await models.User.create(args, { transaction });
                    await models.RoleUser.create({ roleId: 1, userId: user.id }, { transaction });
                    return user;
                });

                return {
                    ok: true,
                    response,
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
            linkedQueryId({
                returnModel: models.Role,
                midModel: models.RoleUser,
                keyModel: models.User,
                id: userId,
            }),
    },
    UserView: {
        roles: ({ id: userId }, args, { models }) =>
            linkedQueryId({
                returnModel: models.Role,
                midModel: models.RoleUser,
                keyModel: models.User,
                id: userId,
            }),
        openChannels: (parent, args, { models }) => models.Channel.findAll({ where: { locked: false }, raw: true }),
        allRoles: (parent, args, { models }) => models.Role.findAll({ raw: true }),
        allUsers: (parent, args, { models }) => models.User.findAll({ raw: true }),
    },
};
