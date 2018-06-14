import formatErrors from '../formatErrors';
import { requiresAuth } from '../permissions';

export default {
    Query: {
        allChannels: async (parent, args, { models }) => models.Channel.findAll({ raw: true }),
    },
    Mutation: {
        createChannel: async (parent, args, { models }) => {
            try {
                const channel = await models.Channel.create(args);
                return channel.dataValues.id;
            } catch (err) {
                console.log(err);
                return -1;
            }
        },
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
        messages: ({ id: channelId }, args, { models }) => models.Message.findAll({ channelId }),
        roles: ({ id: channelId }, args, { models }) =>
            models.Role.findAll({
                include: [{ model: models.Channel, where: { '$channels.id$': channelId } }],
            }),
    },
};
