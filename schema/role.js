export default `

    type Role {
        id: Int!
        permissions: [Permission!]!
        members: [User!]!
        channels: [Channel!]!
    }

`;
