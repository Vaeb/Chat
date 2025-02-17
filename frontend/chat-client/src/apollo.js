import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { ApolloLink, split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';

const debugging = false;

const uri = debugging ? 'http://localhost:8080/graphql' : 'http://vaeb.io:8080/graphql';
const uriWs = debugging ? 'ws://localhost:8080/subscriptions' : 'ws://vaeb.io:8080/subscriptions';

const httpLink = createHttpLink({ uri });

const middlewareLink = setContext(() => ({
    headers: {
        'x-token': localStorage.getItem('token'),
        'x-refresh-token': localStorage.getItem('refreshToken'),
    },
}));

const afterwareLink = new ApolloLink((operation, forward) => {
    const { headers } = operation.getContext();

    if (headers) {
        const token = headers.get('x-token');
        const refreshToken = headers.get('x-refresh-token');

        if (token) {
            localStorage.setItem('token', token);
        }

        if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken);
        }
    }

    return forward(operation);
});

const httpLinkWithMiddleware = afterwareLink.concat(middlewareLink.concat(httpLink));

const wsLink = new WebSocketLink({
    uri: uriWs,
    options: {
        reconnect: true,
    },
});

const link = split(
    ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    httpLinkWithMiddleware,
);

export default new ApolloClient({
    link,
    cache: new InMemoryCache(),
});
