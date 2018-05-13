export default `

    type Message {
        id: Int!
        txt: String!
        user: User!
        channel: Channel!
    }

    type Mutation {
        createMessage(channelId: Int!, text: String!): Int!
    }

`;
