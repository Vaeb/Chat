export default `

    type Query {
        ping: String
        userRoles: [Role!]!
        userPermissions: [Permission!]!
    }

    type SetDataResponse {
        ok: Boolean!
        errors: [Error!]
    }

    type Subscription {
        heartbeat: String!
    }

    type Mutation {
        setData: SetDataResponse!
    }

`;
