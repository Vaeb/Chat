import formatErrors from './formatErrors';
import linkedQuery from './linkedQueries';

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

// eslint-disable-next-line import/prefer-default-export
export const requiresAuth = createResolver((parent, args, { me }) => {
    if (!me || !me.id) {
        throw new Error('Not logged in');
    }
});

export const requiresPermission = permissionName =>
    requiresAuth.createResolver(async (parent, args, { models, me }) => {
        const mePermissions = await linkedQuery({
            keyModel: models.User,
            keyWhere: { id: me.id },
            midModel: models.Role,
            returnModel: models.Permission,
        });

        const hasPermission = mePermissions.some(({ name }) => name === permissionName);

        if (!hasPermission) throw new Error(`This action requires the ${permissionName} permission`);
    });
