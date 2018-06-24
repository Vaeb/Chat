import React from 'react';
import ReactDOM from 'react-dom';
import WebFont from 'webfontloader';

import { ApolloProvider } from 'react-apollo';
import 'semantic-ui-css/semantic.min.css';

// import './index.css';
import Routes from './routes';
import registerServiceWorker from './registerServiceWorker';
import client from './apollo';

WebFont.load({
    google: {
        families: ['Open Sans', 'sans-serif'],
    },
});

const App = (
    <ApolloProvider client={client}>
        <Routes />
    </ApolloProvider>
);

ReactDOM.render(App, document.getElementById('root'));
registerServiceWorker();
