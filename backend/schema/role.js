export default `

    type Role {
        id: Int!
        permissions: [Permission!]!
        members: [User!]!
        channels: [Channel!]!
    }

    type CreateRoleResponse {
        ok: Boolean!
        errors: [Error!]
    }

    type Mutation {
        createRole(name: String!, color: String="#FFFFFF", position: Int): CreateRoleResponse!
    }

`;
