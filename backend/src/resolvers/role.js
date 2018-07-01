import formatErrors from '../formatErrors';
import { requiresAuth, requiresPermission } from '../permissions';
import { linkedQuery, linkedQueryId } from '../linkedQueries';
import { pubsub, NEW_ROLE, NEW_ROLE_USER, REM_ROLE_USER } from '../pubsub';

const canAffectRole = (meRoles, role) => {
    let meOwner = false;
    const roleOwner = role.owner;
    let meHigher = role.position == null;

    meRoles.forEach(({ owner, position }) => {
        if (owner) meOwner = true;
        if (position > role.position) meHigher = true;
    });

    return meOwner || (!roleOwner && meHigher);
};

export default {
    Subscription: {
        newRole: {
            resolve: payload => payload.newRole,
            subscribe: () => pubsub.asyncIterator(NEW_ROLE),
        },
        newRoleUser: {
            resolve: payload => payload.newRoleUser,
            subscribe: () => pubsub.asyncIterator(NEW_ROLE_USER),
        },
        remRoleUser: {
            resolve: payload => payload.remRoleUser,
            subscribe: () => pubsub.asyncIterator(REM_ROLE_USER),
        },
    },
    Query: {
        allRoles: requiresAuth.createResolver(async (parent, args, { models }) => models.Role.findAll({ raw: true })),
    },
    Mutation: {
        createRole: requiresAuth.createResolver(async (parent, args, { models }) => {
            try {
                const role = await models.Role.create(args);

                const asyncFunc = async () => {
                    pubsub.publish(NEW_ROLE, {
                        newRole: {
                            ...role.dataValues,
                            permissions: [],
                            members: [],
                            channels: [],
                        },
                    });
                };

                asyncFunc();

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

                    if (!canAffectRole(meRoles, role)) {
                        return { ok: false, errors: [{ path: 'username', message: 'You are not allowed to give this role' }] };
                    }

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
        remUserFromRole: requiresPermission('ADD_ROLE').createResolver(
            { catchErrors: true },
            async (parent, { userId, roleId }, { models, me }) => {
                try {
                    const meRolesPromise = linkedQuery({
                        keyModel: models.User,
                        keyWhere: { id: me.id },
                        returnModel: models.Role,
                    });

                    const userFoundPromise = models.User.findOne({ where: { id: userId }, raw: true });
                    const roleFoundPromise = models.Role.findOne({ where: { id: roleId }, raw: true });

                    const [meRoles, user, role] = await Promise.all([meRolesPromise, userFoundPromise, roleFoundPromise]);

                    if (!user) return { ok: false, errors: [{ path: 'username', message: 'Could not find user with this id' }] };
                    if (!role) return { ok: false, errors: [{ path: 'username', message: 'Could not find role with this id' }] };

                    if (!canAffectRole(meRoles, role)) {
                        return { ok: false, errors: [{ path: 'username', message: 'You are not allowed to remove this role' }] };
                    }

                    await models.RoleUser.destroy({ where: { roleId, userId } });

                    const asyncFunc = async () => {
                        pubsub.publish(REM_ROLE_USER, {
                            remRoleUser: {
                                role,
                                user,
                            },
                        });
                    };

                    asyncFunc();

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
            },
        ),
    },
    Role: {
        channels: ({ id: roleId, channels }, args, { models }) =>
            channels ||
            linkedQueryId({
                returnModel: models.Channel,
                midModel: models.RoleChannel,
                keyModel: models.Role,
                id: roleId,
            }),
        members: ({ id: roleId, members }, args, { models }) =>
            members ||
            linkedQueryId({
                returnModel: models.User,
                midModel: models.RoleUser,
                keyModel: models.Role,
                id: roleId,
            }),
        permissions: ({ id: roleId, permissions }, args, { models }) =>
            permissions ||
            linkedQueryId({
                returnModel: models.Permission,
                midModel: models.RolePermission,
                keyModel: models.Role,
                id: roleId,
            }),
    },
    ChannelRole: {
        send: ({ send }) => send,
    },
    NewRoleUser: {
        role: ({ role }) => role,
        user: ({ user }) => user,
    },
    RemRoleUser: {
        role: ({ role }) => role,
        user: ({ user }) => user,
    },
};
