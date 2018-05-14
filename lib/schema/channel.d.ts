declare const _default: "\n\n    type Channel {\n        id: Int!\n        name: String!\n        messages: [Message!]!\n        roles: [Role!]!\n    }\n\n    type Mutation {\n        createChannel(name: String!): Int!\n    }\n\n";
export default _default;
