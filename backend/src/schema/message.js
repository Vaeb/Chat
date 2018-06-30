export default `

    type Message {
        id: Int!
        text: String!
        user: User!
        channel: Channel!
        created_at: String!
        chatId: String
    }

    type CreateMessageResponse {
        ok: Boolean!
        message: Message
        errors: [Error!]
    }

    type Query {
        getMessages(channelId: Int!): [Message!]!
        allMessages(numFetch: Int): [[Message!]!]!
    }

    type Subscription {
        newChannelMessage: Message!
    }

    type Mutation {
        createMessage(channelId: Int!, text: String!, chatId: String): CreateMessageResponse!
    }

`;
