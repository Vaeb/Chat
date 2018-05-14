"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = `

    type Message {
        id: Int!
        txt: String!
        user: User!
        channel: Channel!
    }

    type Mutation {
        createMessage(channelId: Int!, text: String!): Int!
    }

`;
//# sourceMappingURL=message.js.map