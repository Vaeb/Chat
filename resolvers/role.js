export default {
    Mutation: {
        createRole: (parent, args, { models }) => {
            if (!args.hasOwnProperty('color')) args.color = '#FFFFFF';
            return models.Role.create(args);
        },
    },
};
