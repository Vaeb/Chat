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

    type RemUserFromRoleResponse {
        ok: Boolean!
        errors: [Error!]
    }

    type NewRoleUser {
        role: Role!
        user: User!
    }

    type RemRoleUser {
        role: Role!
        user: User!
    }

    type Query {
        allRoles: [Role!]!
    }

    type Subscription {
        newRole: Role!
        newRoleUser: NewRoleUser!
        remRoleUser: RemRoleUser!
    }

    type Mutation {
        createRole(name: String!, color: String="#B9BBBE", position: String, view: Boolean=true, owner: Boolean=false): CreateRoleResponse!
        addUsersToRoles(userIds: [String!]!, roleIds: [String!]!): CreateRoleResponse!
        addUserToRole(username: String!, roleId: Int!): AddUserToRoleResponse!
        remUserFromRole(userId: Int!, roleId: Int!): RemUserFromRoleResponse!
    }

`;
