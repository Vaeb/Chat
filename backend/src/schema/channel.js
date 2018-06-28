export default `

    type Channel {
        id: Int!
        name: String!
        locked: Boolean!
        messages: [Message!]!
        roles: [Role!]!
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
