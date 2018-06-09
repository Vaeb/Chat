export default `

    type Permission {
        id: Int!
        name: String!
    }

    type Query {
        getPermission(id: Int!): Permission!
    }

    type Mutation {
        createPermission(name: String!): Int!
    }

`;
