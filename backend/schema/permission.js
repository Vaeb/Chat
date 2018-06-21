export default `

    type Permission {
        id: Int!
        name: String!
    }

    type Query {
        getPermission(id: Int!): Permission!
    }

    type PermissionResponse {
        ok: Boolean!
        permission: Permission
        errors: [Error!]
    }

    type Mutation {
        createPermission(name: String!): PermissionResponse!
    }

`;
