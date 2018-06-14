export default `

    type Channel {
        id: Int!
        name: String!
        messages: [Message!]!
        roles: [Role!]!
    }

    type Query {
        allChannels: [Channel!]!
    }

    type Mutation {
        createChannel(name: String!): Int!
        addRolesToChannels(roleIds: [String!]!, channelIds: [String!]!): CreateRoleResponse!
    }

`;
