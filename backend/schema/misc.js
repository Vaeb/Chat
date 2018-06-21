export default `

    type Query {
        ping: String
        userRoles: [Role!]!
    }

    type SetDataResponse {
        ok: Boolean!
        errors: [Error!]
    }

    type Mutation {
        setData: SetDataResponse!
    }

`;
