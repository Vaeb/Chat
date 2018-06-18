export default `

    type Role {
        id: Int!
        name: String!
        color: String!
        position: Int
        view: Boolean!
        permissions: [Permission!]!
        members: [User!]!
        channels: [Channel!]!
    }

    type CreateRoleResponse {
        ok: Boolean!
        errors: [Error!]
    }

    type Query {
        allRoles: [Role!]!
    }

    type Mutation {
        createRole(name: String!, color: String="#B9BBBE", position: String, view: Boolean=true): CreateRoleResponse!
        addUsersToRoles(userIds: [String!]!, roleIds: [String!]!): CreateRoleResponse!
    }

`;
