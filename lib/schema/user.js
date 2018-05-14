"use strict";
// CRUD
// Create
// Read
// Update
// Delete
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = `

    type User {
        id: Int!
        username: String!
        email: String!
        roles: [Role!]!
    }

    type Query {
        getUser(id: Int!): User!
        allUsers: [User!]!
    }

    type Mutation {
        createUser(username: String!, email: String!, password: String!): User!
    }

`;
//# sourceMappingURL=user.js.map