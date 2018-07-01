import formatErrors from './formatErrors';
import { linkedQuery } from './linkedQueries';

const createResolver = (resolver) => {
    const baseResolver = resolver;

    baseResolver.createResolver = (options, childResolver) => {
        const newResolver = async (parent, args, context, info) => {
            if (childResolver == null) {
                childResolver = options;
                options = {};
            }

            if (options.catchErrors) {
                try {
                    await resolver(parent, args, context, info);
                    return childResolver(parent, args, context, info);
                } catch (err) {
                    console.log('[PERMISSIONS ERROR]', err);
                    return {
                        ok: false,
                        errors: formatErrors(err, context.models),
                    };
                }
            } else {
                await resolver(parent, args, context, info);
                return childResolver(parent, args, context, info);
            }
        };

        return createResolver(newResolver, false);
    };

    return baseResolver;
};

export const requiresAuth = createResolver((parent, args, { me }) => {
    if (!me || !me.id) {
        throw new Error('Not logged in');
    }
});

export const requiresPermission = permissionName =>
    requiresAuth.createResolver(async (parent, args, { models, me }) => {
        const { Op } = models.Sequelize;
        // const { gt, lte, ne, in: opIn } = Op;

        const foundPermissions = await linkedQuery({
            keyModel: models.User,
            keyWhere: { id: me.id },
            midModel: models.Role,
            returnModel: models.Permission,
            returnWhere: {
                name: permissionName,
            },
        });

        if (foundPermissions.length == 0) {
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

            if (!isOwner) throw new Error(`This action requires the ${permissionName || 'owner'} permission`);
        }
    });
