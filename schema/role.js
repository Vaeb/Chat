export default `

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
