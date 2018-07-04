import { tryLogin, tryVashtaAuth } from '../auth';
import formatErrors from '../formatErrors';
import { requiresAuth } from '../permissions';
import { linkedQueryId } from '../linkedQueries';
import { pubsub, NEW_USER } from '../pubsub';

const registerLocked = true;

/*

    -chatData GraphQL query request
    -GraphQL passes args to chatData resolver method
    -Resolver returns the found User
    -GraphQL formats User to the UserView schema's structure
    -Attributes in the UserView schema that aren't in the returned User are sourced from resolver UserView object's relevantly named methods
    -Formatted UserView object is checked against the schema for errors and returned

*/

export default {
    Subscription: {
        newUser: {
            resolve: payload => payload.newUser,
            subscribe: () => pubsub.asyncIterator(NEW_USER),
        },
    },
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
                if (registerLocked) return { ok: false, errors: [{ path: 'email', message: 'Registrations are still closed.' }] };

                let user;
                const rolePromise = models.Role.findOne({ where: { id: 1 }, raw: true });

                const response = await models.sequelize.transaction(async (transaction) => {
                    user = await models.User.create(args, { transaction });
                    await models.RoleUser.create({ roleId: 1, userId: user.id }, { transaction });
                    return user;
                });

                const asyncFunc = async () => {
                    const role = await rolePromise;

                    pubsub.publish(NEW_USER, {
                        newUser: {
                            ...user.dataValues,
                            roles: [role],
                        },
                    });
                };

                asyncFunc();

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
        linkVashta: requiresAuth.createResolver(async (parent, { username, password }, { models, me }) => {
            try {
                console.log('trying');
                const vashtaUser = await tryVashtaAuth(username, password);

                return {
                    ok: true,
                    vashtaUser,
                };
            } catch (err) {
                console.log(err);
                return {
                    ok: false,
                    errors: formatErrors(err, models),
                };
            }
        }),
    },
    User: {
        roles: ({ id: userId, roles }, args, { models }) =>
            roles ||
            linkedQueryId({
                returnModel: models.Role,
                midModel: models.RoleUser,
                keyModel: models.User,
                id: userId,
            }),
    },
    UserView: {
        allChannels: async (parent, args, { models }) => models.Channel.findAll({ raw: true }),
        allRoles: (parent, args, { models }) => models.Role.findAll({ raw: true }),
        allUsers: (parent, args, { models }) => models.User.findAll({ raw: true }),
    },
};
