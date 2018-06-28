import formatErrors from '../formatErrors';
import { requiresAuth, requiresPermission } from '../permissions';
import { linkedQuery, linkedQueryId } from '../linkedQueries';
import { pubsub, NEW_ROLE_USER } from '../pubsub';

export default {
    Subscription: {
        newRoleUser: {
            resolve: payload => payload.newRoleUser,
            subscribe: () => pubsub.asyncIterator(NEW_ROLE_USER),
        },
    },
    Query: {
        allRoles: requiresAuth.createResolver(async (parent, args, { models }) => models.Role.findAll({ raw: true })),
    },
    Mutation: {
        createRole: requiresAuth.createResolver(async (parent, args, { models }) => {
            try {
                await models.Role.create(args);

                return {
                    ok: true,
                    errors: [],
                };
            } catch (err) {
                console.log(err);

                return {
                    ok: false,
                    errors: formatErrors(err, models),
                };
            }
        }),
        addUsersToRoles: requiresAuth.createResolver(async (parent, { userIds, roleIds }, { models }) => {
            try {
                /* const usersToAddPromise = models.User.findAll(
                    {
                        where: {
                            id: { [models.Sequelize.Op.or]: userIds },
                        },
                    },
                    { raw: true },
                );

                const [usersToAdd] = await Promise.all([usersToAddPromise]); */

                const addRows = [];

                for (let i = 0; i < userIds.length; i++) {
                    const userId = userIds[i];

                    for (let j = 0; j < roleIds.length; j++) {
                        addRows.push({ userId, roleId: roleIds[j] });
                    }
                }

                await models.RoleUser.bulkCreate(addRows);

                return {
                    ok: true,
                    errors: [],
                };
            } catch (err) {
                console.log('++++++++++++++++++++++++++++++++');
                console.log('ERROR:', err);
                console.log('--------------------------------');

                return {
                    ok: false,
                    errors: formatErrors(err, models),
                };
            }
        }),
        addUserToRole: requiresPermission('ADD_ROLE').createResolver(
            { catchErrors: true },
            async (parent, { username, roleId }, { models, me }) => {
                try {
                    const meRolesPromise = linkedQuery({
                        keyModel: models.User,
                        keyWhere: { id: me.id },
                        returnModel: models.Role,
                    });

                    const userFoundPromise = models.User.findOne({ where: { username }, raw: true });
                    const roleFoundPromise = models.Role.findOne({ where: { id: roleId }, raw: true });

                    const [meRoles, user, role] = await Promise.all([meRolesPromise, userFoundPromise, roleFoundPromise]);

                    if (!user) return { ok: false, errors: [{ path: 'username', message: 'Could not find user with this username' }] };
                    if (!role) return { ok: false, errors: [{ path: 'username', message: 'Could not find role with this id' }] };

                    let meOwner = false;
                    const roleOwner = role.owner;
                    let meHigher = role.position == null;

                    meRoles.forEach(({ owner, position }) => {
                        if (owner) meOwner = true;
                        if (position > role.position) meHigher = true;
                    });

                    const canAdd = meOwner || (!roleOwner && meHigher);

                    if (!canAdd) return { ok: false, errors: [{ path: 'username', message: 'You are not allowed to give this role' }] };

                    await models.RoleUser.create({ roleId, userId: user.id });

                    const asyncFunc = async () => {
                        pubsub.publish(NEW_ROLE_USER, {
                            newRoleUser: {
                                role,
                                user,
                            },
                        });
                    };

                    asyncFunc();

                    return {
                        ok: true,
                        user,
                        errors: [],
                    };
                } catch (err) {
                    console.log('++++++++++++++++++++++++++++++++');
                    console.log('ERROR:', err);
                    console.log('--------------------------------');

                    return {
                        ok: false,
                        errors: formatErrors(err, models),
                    };
                }
            },
        ),
    },
    Role: {
        channels: ({ id: roleId }, args, { models }) =>
            linkedQueryId({
                returnModel: models.Channel,
                midModel: models.RoleChannel,
                keyModel: models.Role,
                id: roleId,
            }),
        members: ({ id: roleId }, args, { models }) =>
            linkedQueryId({
                returnModel: models.User,
                midModel: models.RoleUser,
                keyModel: models.Role,
                id: roleId,
            }),
        permissions: ({ id: roleId }, args, { models }) =>
            linkedQueryId({
                returnModel: models.Permission,
                midModel: models.RolePermission,
                keyModel: models.Role,
                id: roleId,
            }),
    },
    NewRoleUser: {
        role: ({ role }) => role,
        user: ({ user }) => user,
    },
};
