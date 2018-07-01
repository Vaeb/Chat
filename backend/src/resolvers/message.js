// import { withFilter } from 'graphql-subscriptions';
// import flatten from 'lodash/flatten';
import formatErrors from '../formatErrors';
import { requiresAuth } from '../permissions';
import { pubsub, NEW_CHANNEL_MESSAGE } from '../pubsub';

export default {
    Subscription: {
        newChannelMessage: {
            resolve: payload => payload.newChannelMessage,
            subscribe: () => pubsub.asyncIterator(NEW_CHANNEL_MESSAGE),
        },
    },
    Query: {
        getMessages: async (parent, { channelId }, { models }) => {
            const messages = models.Message.findAll({
                where: { channelId },
                order: [['created_at', 'DESC']],
                limit: 35,
                raw: true,
            });

            return messages;
        },
        allMessages: async (parent, { numFetch }, { models }) => {
            if (numFetch == null) numFetch = 35;

            const channels = await models.Channel.findAll({ attributes: ['id'], raw: true });

            const allPromises = channels.map(({ id }) =>
                models.Message.findAll({
                    where: { channelId: id },
                    order: [['created_at', 'DESC']],
                    limit: 35,
                    raw: true,
                }));

            const allMessages = await Promise.all(allPromises);

            return allMessages;
        },
    },
    Mutation: {
        createMessage: requiresAuth.createResolver(async (parent, { chatId, ...args }, { models, me }) => {
            try {
                const { channelId } = args;

                const isOwner =
                    (await models.Role.sequelize.query(
                        `select distinct owner from users as u
                        join roleusers as ru
                        on ru.user_id = u.id and u.id = ?
                        join roles as r
                        on r.id = ru.role_id and r.owner = true`,
                        {
                            replacements: [me.id],
                            model: models.Role,
                            raw: true,
                        },
                    )).length > 0;

                const noSend = isOwner
                    ? []
                    : await models.Role.sequelize.query(
                        `select distinct send from channels as c
                        left outer join rolechannels as rc
                        on rc.channel_id = c.id
                        left outer join roleusers as ru
                        on ru.role_id = rc.role_id and ru.user_id = :userId
                        where c.id = :channelId and c.default_send = false`,
                        {
                            replacements: { userId: me.id, channelId },
                            model: models.Role,
                            raw: true,
                        },
                    );

                console.log(noSend);

                if (noSend.length > 0 && !noSend.some(crData => crData.send)) {
                    return { ok: false, errors: [{ path: 'auth', message: 'You do not have a required role for sending messages here' }] };
                }

                const currentUserPromise = models.User.findOne({
                    where: {
                        id: me.id,
                    },
                    raw: true,
                });

                const currentChannelPromise = models.Channel.findOne({
                    where: {
                        id: channelId,
                    },
                    raw: true,
                });

                const message = await models.Message.create({
                    ...args,
                    userId: me.id,
                });

                const asyncFunc = async () => {
                    const [currentUser, currentChannel] = await Promise.all([currentUserPromise, currentChannelPromise]);

                    pubsub.publish(NEW_CHANNEL_MESSAGE, {
                        channelId: args.channelId,
                        newChannelMessage: {
                            ...message.dataValues,
                            user: currentUser,
                            channel: currentChannel,
                            chatId,
                        },
                    });
                };

                asyncFunc();

                return {
                    ok: true,
                    message,
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
    },
    Message: {
        user: ({ user, userId }, args, { models }) => {
            if (user) return user;

            return models.User.findOne({ where: { id: userId }, raw: true });
        },
        channel: ({ channel, channelId }, args, { models }) => {
            if (channel) return channel;

            return models.Channel.findOne({ where: { id: channelId }, raw: true });
        },
    },
};
