import formatErrors from '../formatErrors';
import { requiresAuth } from '../permissions';

export default {
    Query: {
        getMessages: requiresAuth.createResolver(async (parent, { channelId }, { models }) => {
            const messages = models.Message.findAll({
                where: { channelId },
                order: [['created_at', 'ASC']],
                limit: 35,
                raw: true,
            });

            return messages;
        }),
    },
    Mutation: {
        createMessage: requiresAuth.createResolver(async (parent, args, { models, me }) => {
            try {
                const message = await models.Message.create({
                    ...args,
                    userId: me.id,
                });

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
    },
};
