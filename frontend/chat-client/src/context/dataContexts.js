import React from 'react';
import Compose from 'react-compose-context-consumers';

export const allChannelsContext = React.createContext({ default: 'allChannels' });
export const allRolesContext = React.createContext({ default: 'allRoles' });
export const allUsersContext = React.createContext({ default: 'allUsers' });
export const viewChannelsContext = React.createContext([{ default: 'viewChannels' }]);
export const viewRolesContext = React.createContext([{ default: 'viewRoles' }]);
export const viewUsersContext = React.createContext([{ default: 'viewUsers' }]);
export const nowUserContext = React.createContext({ default: 'nowUser' });
export const nowChannelContext = React.createContext({ default: 'nowChannel' });
export const pushUpContext = React.createContext({ default: 'pushUp' });
export const selfMessageContext = React.createContext({ default: 'selfMessage' });

const contextMap = {
    allChannels: allChannelsContext,
    allRoles: allRolesContext,
    allUsers: allUsersContext,
    viewChannels: viewChannelsContext,
    viewRoles: viewRolesContext,
    viewUsers: viewUsersContext,
    nowUser: nowUserContext,
    nowChannel: nowChannelContext,
    pushUp: pushUpContext,
    selfMessage: selfMessageContext,
};

export const withData = (Component, contextNames) => {
    const consumers = contextNames.reduce((o, name) => {
        o[name] = contextMap[name].Consumer;
        return o;
    }, {});
    return props => <Compose {...consumers}>{chatData => <Component {...props} chatData={chatData} />}</Compose>;
};
