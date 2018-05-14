declare const _default: "\n\n    type Message {\n        id: Int!\n        txt: String!\n        user: User!\n        channel: Channel!\n    }\n\n    type Mutation {\n        createMessage(channelId: Int!, text: String!): Int!\n    }\n\n";
export default _default;
