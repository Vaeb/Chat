import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import decode from 'jwt-decode';

import Home from './Home';
import Register from './Register';
import Login from './Login';
import CreateRole from './CreateRole';
import AddUsersToRoles from './AddUsersToRoles';
import AddRolesToChannels from './AddRolesToChannels';
import ViewChat from './ViewChat';
import SetData from './SetData';

const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');

    try {
        decode(token);
        decode(refreshToken);
    } catch (err) {
        return false;
    }

    return true;
};

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            (isAuthenticated() ? (
                <Component {...props} />
            ) : (
                <Redirect
                    to={{
                        pathname: '/login',
                        state: { from: props.location },
                    }}
                />
            ))
        }
    />
);

export default () => (
    <BrowserRouter>
        <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/register" exact component={Register} />
            <Route path="/login" exact component={Login} />
            <Route path="/view-chat/:channelId?" exact component={ViewChat} />
            <PrivateRoute path="/create-role" exact component={CreateRole} />
            <PrivateRoute path="/add-user-to-role" exact component={AddUsersToRoles} />
            <PrivateRoute path="/add-role-to-channel" exact component={AddRolesToChannels} />
            <Route path="/set-data" exact component={SetData} />
        </Switch>
    </BrowserRouter>
);
