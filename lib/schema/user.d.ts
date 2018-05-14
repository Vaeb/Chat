declare const _default: "\n\n    type User {\n        id: Int!\n        username: String!\n        email: String!\n        roles: [Role!]!\n    }\n\n    type Query {\n        getUser(id: Int!): User!\n        allUsers: [User!]!\n    }\n\n    type Mutation {\n        createUser(username: String!, email: String!, password: String!): User!\n    }\n\n";
export default _default;
