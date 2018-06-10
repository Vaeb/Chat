import bcrypt from 'bcrypt';

export default {
    Query: {
        getUser: (parent, { id }, { models }) => models.User.findOne({ where: { id } }),
        allUsers: (parent, args, { models }) => models.User.findAll(),
    },
    Mutation: {
        register: async (parent, { password, ...otherArgs }, { models }) => {
            try {
                const hashedPassword = await bcrypt.hash(password, 10);
                const user = await models.User.create({ ...otherArgs, password: hashedPassword });
                return user.dataValues.id;
            } catch (err) {
                console.log(err);
                return -1;
            }
        },
    },
};
