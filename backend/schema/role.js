export default `

    type Role {
        id: Int!
        name: String!
        color: String!
        position: Int
        view: Boolean!
        owner: Boolean!
        permissions: [Permission!]!
        members: [User!]!
        channels: [Channel!]!
    }

    type CreateRoleResponse {
        ok: Boolean!
        errors: [Error!]
    }

    type AddUserToRoleResponse {
        ok: Boolean!
        user: User
        errors: [Error!]
    }

    type Query {
        allRoles: [Role!]!
    }

    type Mutation {
        createRole(name: String!, color: String="#B9BBBE", position: String, view: Boolean=true, owner: Boolean=false): CreateRoleResponse!
        addUsersToRoles(userIds: [String!]!, roleIds: [String!]!): CreateRoleResponse!
        addUserToRole(username: String!, roleId: Int!): AddUserToRoleResponse!
    }

`;
