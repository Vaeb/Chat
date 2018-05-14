import { graphiqlExpress, graphqlExpress, GraphQLOptions } from 'apollo-server-express';
import * as express from 'express';
import { makeExecutableSchema } from 'graphql-tools';
import * as path from 'path';

const { fileLoader, mergeResolvers, mergeTypes } = require('merge-graphql-schemas');

import models, { Models } from './models';

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './schema')));
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')));

export interface SequelizeContext {
  models: Models;
  user: {
    id: number;
  };
}
const schema = makeExecutableSchema<SequelizeContext>({
  typeDefs,
  resolvers,
});

const app = express();

const graphqlEndpoint = '/graphql';

app.use(graphqlEndpoint, express.json(), graphqlExpress({
  schema,
  context: {
    models,
    user: {
      id: 1,
    },
  },
} as GraphQLOptions<SequelizeContext>));

app.use('/graphiql', graphiqlExpress({ endpointURL: graphqlEndpoint }));

models.sequelize.sync({}).then(() => {
  app.listen(8080);
});
