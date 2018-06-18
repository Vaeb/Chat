export default `

    type Channel {
        id: Int!
        name: String!
        locked: Boolean!
        messages: [Message!]!
        roles: [Role!]!
    }

    type Query {
        allChannels: [Channel!]!
    }

    type Mutation {
        createChannel(name: String!, locked: Boolean=false): Int!
        addRolesToChannels(roleIds: [String!]!, channelIds: [String!]!): CreateRoleResponse!
    }

`;
