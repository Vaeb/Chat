import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import decode from 'jwt-decode';

// import Home from './Home';
import Register from './Register';
import Login from './Login';
import CreateRole from './CreateRole';
import CreateChannel from './CreateChannel';
import AddUsersToRoles from './AddUsersToRoles';
import AddRolesToChannels from './AddRolesToChannels';
import ViewChatWrapper from './ViewChatWrapper';
import SetData from './SetData';
import AllPages from '../components/AllPages';

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

const CustomRoute = ({ component: Component, isPrivate, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            (!isPrivate || isAuthenticated() ? (
                <React.Fragment>
                    <AllPages />
                    <Component {...props} />
                </React.Fragment>
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
            {/* <Route path="/" exact component={Home} /> */}
            <Route path="/" exact render={() => <Redirect to="/view-chat" />} />
            <CustomRoute path="/register" exact component={Register} />
            <CustomRoute path="/login" exact component={Login} />
            <CustomRoute isPrivate path="/view-chat/:channelId?" exact component={ViewChatWrapper} />
            <CustomRoute isPrivate path="/create-role" exact component={CreateRole} />
            <CustomRoute isPrivate path="/create-channel" exact component={CreateChannel} />
            <CustomRoute isPrivate path="/add-user-to-role" exact component={AddUsersToRoles} />
            <CustomRoute isPrivate path="/add-role-to-channel" exact component={AddRolesToChannels} />
            <CustomRoute path="/set-data" exact component={SetData} />
        </Switch>
    </BrowserRouter>
);
