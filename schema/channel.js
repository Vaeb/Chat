export default `

    type Channel {
        id: Int!
        name: String!
        messages: [Message!]!
        roles: [Role!]!
    }

    type Mutation {
        createChannel(name: String!): Int!
    }

`;
