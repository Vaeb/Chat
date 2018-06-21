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

    type Mutation {
        setData: SetDataResponse!
    }

`;
