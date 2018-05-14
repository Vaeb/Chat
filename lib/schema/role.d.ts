declare const _default: "\n\n    type Role {\n        id: Int!\n        permissions: [Permission!]!\n        members: [User!]!\n        channels: [Channel!]!\n    }\n\n    type Mutation {\n        createRole(name: String!, color: String=\"#FFFFFF\", position: Int): Int!\n    }\n\n";
export default _default;
