"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = `

    type Role {
        id: Int!
        permissions: [Permission!]!
        members: [User!]!
        channels: [Channel!]!
    }

    type Mutation {
        createRole(name: String!, color: String="#FFFFFF", position: Int): Int!
    }

`;
//# sourceMappingURL=role.js.map