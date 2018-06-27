import formatErrors from '../formatErrors';
import { requiresAuth, requiresPermission } from '../permissions';
import { linkedQuery, linkedQueryId } from '../linkedQueries';
import pubsub from '../pubsub';

const NEW_CHANNEL = 'NEW_CHANNEL';

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
            async (parent, { name, locked, roleIds }, { models }) => {
                try {
                    const channel = await models.Channel.create({ name, locked });

                    const asyncFunc = async () => {
                        pubsub.publish(NEW_CHANNEL, {
                            newChannel: {
                                ...channel.dataValues,
                                roles: [],
                                messages: [],
                            },
                        });
                    };

                    asyncFunc();

                    if (roleIds && roleIds.length > 0) {
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
