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

    type RunSeqResponse {
        ok: Boolean!
        errors: [Error!]
        output: String
    }

    type Subscription {
        heartbeat: String!
    }

    type Mutation {
        setData: SetDataResponse!
        runSeq(text: String!): RunSeqResponse!
    }

`;
