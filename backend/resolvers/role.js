import formatErrors from '../formatErrors';
import { requiresAuth } from '../permissions';

export default {
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
    },
};
