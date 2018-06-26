import React from 'react';
import Compose from 'react-compose-context-consumers';

export const allRolesContext = React.createContext({});
export const allChannelsContext = React.createContext({});
export const allUsersContext = React.createContext({});
export const viewRolesContext = React.createContext([]);
export const viewChannelsContext = React.createContext([]);
export const viewUsersContext = React.createContext([]);
export const nowUserContext = React.createContext([]);
export const nowChannelContext = React.createContext([]);

const contextMap = {
    allRoles: allUsersContext,
    allChannels: allChannelsContext,
    allUsers: allUsersContext,
    viewRoles: viewRolesContext,
    viewChannels: viewChannelsContext,
    viewUsers: viewUsersContext,
    nowUser: nowUserContext,
    nowChannel: nowChannelContext,
};

export const withData = (Component, contextNames) => (props) => {
    const consumers = contextNames.reduce((o, name) => {
        o[name] = contextMap[name].Consumer;
        return o;
    }, {});

    return <Compose {...consumers}>{chatData => <Component {...props} chatData={chatData} />}</Compose>;
};
