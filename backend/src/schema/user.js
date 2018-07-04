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

    type VashtaUser {
        id: Int!
        username: String!
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

    type LinkVashtaResponse {
        ok: Boolean!
        errors: [Error!]
        vashtaUser: VashtaUser
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
        linkVashta(username: String!, password: String!): LinkVashtaResponse!
    }

`;
