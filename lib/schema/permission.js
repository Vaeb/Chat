"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = `

    type Permission {
        id: Int!
        name: String!
    }

    type Query {
        getPermission(id: Int!): Permission!
    }

    type Mutation {
        createPermission(name: String!): Int!
    }

`;
//# sourceMappingURL=permission.js.map