export default `

    type Message {
        id: Int!
        text: String!
        user: User!
        channel: Channel!
        created_at: String!
    }

    type CreateMessageResponse {
        ok: Boolean!
        message: Message
        errors: [Error!]
    }

    type Query {
        getMessages(channelId: Int!): [Message!]!
    }

    type Mutation {
        createMessage(channelId: Int!, text: String!): CreateMessageResponse!
    }

`;
