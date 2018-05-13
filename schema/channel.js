export default `

    type Channel {
        id: Int!
        name: String!
        messages: [Message!]!
        roles: [Role!]!
    }

`;
