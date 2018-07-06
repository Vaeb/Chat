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
        vashtaId: Int
        vashtaUsername: String
        roles: [Role!]!
    }

    type UserView {
        id: Int!
        username: String!
        email: String!
        vashtaId: Int
        vashtaUsername: String
        allChannels: [Channel!]!
        allRoles: [Role!]!
        allUsers: [User!]!
    }

    type VashtaUser {
        id: Int!
        username: String!
        email: String!
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
        changeUser: User!
    }

    type Mutation {
        register(username: String!, email: String!, password: String!): RegisterResponse!
        login(email: String!, password: String!): LoginResponse!
        linkVashta(email: String!, password: String!): LinkVashtaResponse!
    }

`;
