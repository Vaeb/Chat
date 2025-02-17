import { tryLogin, tryVashtaAuth } from '../auth';
import formatErrors from '../formatErrors';
import { requiresAuth } from '../permissions';
import { linkedQueryId } from '../linkedQueries';
import { pubsub, NEW_USER, CHANGE_USER } from '../pubsub';
import mutate from '../mutate';

const registerLocked = false;
const buyerId = 4;

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
        changeUser: {
            resolve: payload => payload.changeUser,
            subscribe: () => pubsub.asyncIterator(CHANGE_USER),
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
        linkVashta: requiresAuth.createResolver(async (parent, { email, password }, { models, me }) => {
            try {
                const vashtaUserData = await tryVashtaAuth(email, password);
                const vashtaUser = { id: vashtaUserData.id, username: vashtaUserData.username, email: vashtaUserData.email };

                await models.sequelize.transaction(async (transaction) => {
                    const updateData = await models.User.update(
                        { vashtaId: vashtaUser.id, vashtaUsername: vashtaUser.username },
                        { where: { id: me.id }, returning: true, transaction },
                    );

                    const user = updateData[1][0];

                    await mutate.addUserToRole({ roleId: buyerId, userId: me.id, user: { ...user.dataValues }, transaction });
                });

                return {
                    ok: true,
                    vashtaUserData,
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
