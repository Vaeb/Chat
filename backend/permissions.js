const createResolver = (resolver) => {
    const baseResolver = resolver;
    baseResolver.createResolver = (childResolver) => {
        const newResolver = async (parent, args, context, info) => {
            await resolver(parent, args, context, info);
            return childResolver(parent, args, context, info);
        };
        return createResolver(newResolver);
    };
    return baseResolver;
};

// eslint-disable-next-line import/prefer-default-export
export const requiresAuth = createResolver((parent, args, context) => {
    if (!context.me || !context.me.id) {
        throw new Error('Not logged in');
    }
});
