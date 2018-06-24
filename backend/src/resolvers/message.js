import { withFilter } from 'graphql-subscriptions';
// import formatErrors from '../formatErrors';
import { requiresAuth } from '../permissions';
import pubsub from '../pubsub';

const NEW_CHANNEL_MESSAGE = 'NEW_CHANNEL_MESSAGE';

export default {
    Subscription: {
        newChannelMessage: {
            subscribe: withFilter(() => pubsub.asyncIterator(NEW_CHANNEL_MESSAGE), (payload, args) => payload.channelId === args.channelId),
        },
    },
    Query: {
        getMessages: requiresAuth.createResolver(async (parent, { channelId }, { models }) => {
            const messages = models.Message.findAll({
                where: { channelId },
                order: [['created_at', 'DESC']],
                limit: 35,
                raw: true,
            });

            return messages;
        }),
    },
    Mutation: {
        createMessage: requiresAuth.createResolver(async (parent, args, { models, me }) => {
            try {
                const currentUserPromise = models.User.findOne({
                    where: {
                        id: me.id,
                    },
                });

                const message = await models.Message.create({
                    ...args,
                    userId: me.id,
                });

                const asyncFunc = async () => {
                    const currentUser = await currentUserPromise;

                    pubsub.publish(NEW_CHANNEL_MESSAGE, {
                        channelId: args.channelId,
                        newChannelMessage: {
                            ...message.dataValues,
                            user: currentUser.dataValues,
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
    },
};
