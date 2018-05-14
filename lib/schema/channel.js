"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = `

    type Channel {
        id: Int!
        name: String!
        messages: [Message!]!
        roles: [Role!]!
    }

    type Mutation {
        createChannel(name: String!): Int!
    }

`;
//# sourceMappingURL=channel.js.map