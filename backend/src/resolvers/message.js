import { withFilter } from 'graphql-subscriptions';
// import flatten from 'lodash/flatten';
// import formatErrors from '../formatErrors';
import { requiresAuth } from '../permissions';
import pubsub from '../pubsub';

const NEW_CHANNEL_MESSAGE = 'NEW_CHANNEL_MESSAGE';

export default {
    Subscription: {
        newChannelMessage: {
            resolve: payload => payload.newChannelMessage,
            subscribe: withFilter(
                () => pubsub.asyncIterator(NEW_CHANNEL_MESSAGE),
                (payload, args) => {
                    const payloadData = !payload
                        ? payload
                        : {
                            id: payload.newChannelMessage.id,
                            channelId: payload.newChannelMessage.channelId,
                            channelId2: payload.channelId,
                            text: payload.newChannelMessage.text,
                        };
                    console.log('Got data |', payloadData, '| from client requirements', args);
                    if (!payload) {
                        // console.log('Websocket payload (data sent) is undefined. Payload:', payload, '| Subscription args:', args);
                        return false;
                    }

                    return true;
                },
            ),
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
        createMessage: requiresAuth.createResolver(async (parent, args, { models, me }) => {
            try {
                const currentUserPromise = models.User.findOne({
                    where: {
                        id: me.id,
                    },
                    raw: true,
                });

                const currentChannelPromise = models.Channel.findOne({
                    where: {
                        id: args.channelId,
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
                        },
                    });
                };

                asyncFunc();

                return true;
            } catch (err) {
                console.log(err);

                return false;
            }
        }),
    },
    Message: {
        user: ({ user, userId }, args, { models }) => {
            if (user) return user;

            return models.User.findOne({ where: { id: userId }, raw: true });
        },
        channel: ({ channel, channelId }, args, { models }) => {
            if (channel) {
                return channel;
            }

            return models.Channel.findOne({ where: { id: channelId }, raw: true });
        },
    },
};
