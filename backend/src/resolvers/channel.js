import formatErrors from '../formatErrors';
import { requiresAuth, requiresPermission } from '../permissions';
import { linkedQueryId } from '../linkedQueries';
import { pubsub, NEW_CHANNEL } from '../pubsub';

export default {
    Subscription: {
        newChannel: {
            resolve: payload => payload.newChannel,
            subscribe: () => pubsub.asyncIterator(NEW_CHANNEL),
        },
    },
    Query: {
        allChannels: async (parent, args, { models }) => models.Channel.findAll({ raw: true }),
    },
    Mutation: {
        createChannel: requiresPermission('').createResolver(
            { catchErrors: true },
            async (parent, { name, locked, roles: roleIds = [] }, { models }) => {
                try {
                    const { Op } = models.Sequelize;

                    const channelPromise = models.Channel.create({ name, locked });

                    let rolesPromise;

                    if (roleIds.length) {
                        rolesPromise = models.Role.findAll({
                            where: {
                                id: {
                                    [Op.or]: roleIds,
                                },
                            },
                            raw: true,
                        });
                    }

                    const channel = await channelPromise;

                    const asyncFunc = async () => {
                        const roles = roleIds.length ? await rolesPromise : [];

                        pubsub.publish(NEW_CHANNEL, {
                            newChannel: {
                                ...channel.dataValues,
                                roles,
                                messages: [],
                            },
                        });
                    };

                    asyncFunc();

                    if (roleIds && roleIds.length) {
                        const dataRoleChannel = roleIds.map(roleId => ({ roleId, channelId: channel.id }));
                        await models.RoleChannel.bulkCreate(dataRoleChannel);
                    }

                    return {
                        ok: true,
                        channel,
                    };
                } catch (err) {
                    console.log(err);

                    return {
                        ok: false,
                        errors: formatErrors(err, models),
                    };
                }
            },
        ),
        addRolesToChannels: requiresAuth.createResolver(async (parent, { roleIds, channelIds }, { models }) => {
            try {
                const addRows = [];

                for (let i = 0; i < channelIds.length; i++) {
                    const channelId = channelIds[i];

                    for (let j = 0; j < roleIds.length; j++) {
                        addRows.push({ channelId, roleId: roleIds[j] });
                    }
                }

                await models.RoleChannel.bulkCreate(addRows);

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
    },
    Channel: {
        messages: ({ id: channelId, messages }, args, { models }) =>
            messages || models.Message.findAll({ where: { channelId }, raw: true }),
        roles: ({ id: channelId, roles }, args, { models }) =>
            roles ||
            linkedQueryId({
                returnModel: models.Role,
                midModel: models.RoleChannel,
                keyModel: models.Channel,
                id: channelId,
            }),
    },
};
