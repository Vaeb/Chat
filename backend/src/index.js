import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import path from 'path';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { createServer } from 'http';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';

import models from './models';
import { refreshTokens } from './auth';
import pubsub from './pubsub';

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Promise Rejection at:', p);
    console.log('Reason:', reason);
});

const SECRET = 'afjefyu3235fuahf8421d';
const SECRET2 = 'gfjhslafhga342ghhj1248f';

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './schema')));
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')));

const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

const app = express();
app.use(cors('*'));

const addUser = async (req, res, next) => {
    const token = req.headers['x-token'];
    if (token) {
        try {
            const { user } = jwt.verify(token, SECRET);
            req.user = user;
        } catch (err) {
            const refreshToken = req.headers['x-refresh-token'];
            const newTokens = await refreshTokens(token, refreshToken, models, SECRET, SECRET2);
            if (newTokens.token && newTokens.refreshToken) {
                res.set('Access-Control-Expose-Headers', 'x-token, x-refresh-token');
                res.set('x-token', newTokens.token);
                res.set('x-refresh-token', newTokens.refreshToken);
            }
            req.user = newTokens.user;
        }
    }
    next();
};

app.use(addUser);

const graphqlEndpoint = '/graphql';

app.use(
    graphqlEndpoint,
    bodyParser.json(),
    graphqlExpress(req => ({
        schema,
        context: {
            models,
            me: req.user,
            SECRET,
            SECRET2,
            serverURL: `${req.protocol}://${req.get('host')}`,
        },
    })),
);

app.use(
    '/graphiql',
    graphiqlExpress({
        endpointURL: graphqlEndpoint,
        subscriptionsEndpoint: 'ws://localhost:8080/subscriptions',
    }),
);

const server = createServer(app);

const resetDatabase = false; // DANGEROUS

models.sequelize.sync({ force: resetDatabase }).then(() => {
    server.listen(8080, () => {
        new SubscriptionServer(
            {
                execute,
                subscribe,
                schema,
            },
            {
                server,
                path: '/subscriptions',
            },
        );
    });
});

const HEARTBEAT = 'HEARTBEAT';

setInterval(async () => {
    pubsub.publish(HEARTBEAT, String(+new Date()));
}, 44000); // 44000
