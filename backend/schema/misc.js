export default `

    type Query {
        ping: String
    }

    type SetDataResponse {
        ok: Boolean!
        errors: [Error!]
    }

    type Mutation {
        setData: SetDataResponse!
    }

`;
