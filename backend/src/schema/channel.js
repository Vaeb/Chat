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

    type CreateChannelResponse {
        ok: Boolean!
        channel: Channel
        errors: [Error!]
    }

    type Mutation {
        createChannel(name: String!, locked: Boolean=false, roleIds: [Int!]): CreateChannelResponse!
        addRolesToChannels(roleIds: [String!]!, channelIds: [String!]!): CreateRoleResponse!
    }

`;
