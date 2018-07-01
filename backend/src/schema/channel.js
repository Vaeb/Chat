export default `

    type Channel {
        id: Int!
        name: String!
        locked: Boolean!
        default_send: Boolean!
        messages: [Message!]!
        roles: [Role!]!
        channelRoles: [ChannelRole!]!
    }

    type CreateChannelResponse {
        ok: Boolean!
        channel: Channel
        errors: [Error!]
    }

    type Query {
        allChannels: [Channel!]!
    }

    type Subscription {
        newChannel: Channel!
    }

    type Mutation {
        createChannel(name: String!, locked: Boolean=false, roles: [Int!]): CreateChannelResponse!
        addRolesToChannels(roleIds: [String!]!, channelIds: [String!]!): CreateRoleResponse!
    }

`;
