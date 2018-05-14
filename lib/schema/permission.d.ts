declare const _default: "\n\n    type Permission {\n        id: Int!\n        name: String!\n    }\n\n    type Query {\n        getPermission(id: Int!): Permission!\n    }\n\n    type Mutation {\n        createPermission(name: String!): Int!\n    }\n\n";
export default _default;
