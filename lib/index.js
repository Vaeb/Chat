"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const express = require("express");
const graphql_tools_1 = require("graphql-tools");
const path = require("path");
const { fileLoader, mergeResolvers, mergeTypes } = require('merge-graphql-schemas');
const models_1 = require("./models");
const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './schema')));
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')));
const schema = graphql_tools_1.makeExecutableSchema({
    typeDefs,
    resolvers,
});
const app = express();
const graphqlEndpoint = '/graphql';
app.use(graphqlEndpoint, express.json(), apollo_server_express_1.graphqlExpress({
    schema,
    context: {
        models: models_1.default,
        user: {
            id: 1,
        },
    },
}));
app.use('/graphiql', apollo_server_express_1.graphiqlExpress({ endpointURL: graphqlEndpoint }));
models_1.default.sequelize.sync({}).then(() => {
    app.listen(8080);
});
//# sourceMappingURL=index.js.map