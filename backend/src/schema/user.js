// CRUD
// Create
// Read
// Update
// Delete

export default `

    type User {
        id: Int!
        username: String!
        email: String!
        roles: [Role!]!
    }

    type UserView {
        id: Int!
        username: String!
        email: String!
        allChannels: [Channel!]!
        allRoles: [Role!]!
        allUsers: [User!]!
    }

    type RegisterResponse {
        ok: Boolean!
        user: User
        errors: [Error!]
    }

    type LoginResponse {
        ok: Boolean!
        token: String
        refreshToken: String
        errors: [Error!]
    }

    type Query {
        chatData: UserView!
        getUser(id: Int!): User!
        allUsers: [User!]!
    }

    type Subscription {
        newUser: User!
    }

    type Mutation {
        register(username: String!, email: String!, password: String!): RegisterResponse!
        login(email: String!, password: String!): LoginResponse!
    }

`;
