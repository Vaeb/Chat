"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    Query: {
        getUser: (parent, { id }, { models }) => models.User.findOne({ where: { id } }),
        allUsers: (parent, args, { models }) => models.User.findAll(),
    },
    Mutation: {
        createUser: (parent, args, { models }) => models.User.create(args),
    },
};
//# sourceMappingURL=user.js.map