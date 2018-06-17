export default `

    type Channel {
        id: Int!
        name: String!
        private: Boolean!
        messages: [Message!]!
        roles: [Role!]!
    }

    type Query {
        allChannels: [Channel!]!
    }

    type Mutation {
        createChannel(name: String!, private: Boolean=false): Int!
        addRolesToChannels(roleIds: [String!]!, channelIds: [String!]!): CreateRoleResponse!
    }

`;
